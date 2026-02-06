#!/usr/bin/env python3
"""
Content Orchestrator - Brain of the Scraper System
==================================================
Manages multiple scrapers with priority queues, rate limiting,
error handling, and automatic retries. Logs all activities to Supabase.

Author: PPSDM KMITS LMS
Version: 4.0 (Netflix-style Content Aggregator)
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import asyncio
import aiohttp
import json
import time
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Callable, Any
from dataclasses import dataclass, field, asdict
from enum import Enum
from collections import deque
import heapq
import random

# Supabase Integration
try:
    from supabase import create_client, Client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False
    print("⚠️ Supabase not installed. Database storage disabled.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('scraper_orchestrator.log', encoding='utf-8')
    ]
)
logger = logging.getLogger('ContentOrchestrator')


class ScraperPriority(Enum):
    """Priority levels for scrapers"""
    CRITICAL = 1  # ITS official, scholarships
    HIGH = 2      # Jobs, trending content
    MEDIUM = 3    # News, learning resources
    LOW = 4       # Social media, general content
    BACKGROUND = 5 # Archive, old content


class ScraperStatus(Enum):
    """Status of scraper execution"""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    PARTIAL = "partial"
    FAILED = "failed"
    RETRYING = "retrying"


@dataclass
class ScraperTask:
    """Represents a scraper task in the queue"""
    id: str
    name: str
    priority: ScraperPriority
    scraper_func: Callable
    source_id: Optional[str] = None
    config: Dict = field(default_factory=dict)
    max_retries: int = 3
    retry_count: int = 0
    delay_seconds: int = 2
    timeout_seconds: int = 300
    status: ScraperStatus = ScraperStatus.PENDING
    result: Optional[Dict] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    def __lt__(self, other):
        """For priority queue comparison"""
        return self.priority.value < other.priority.value


@dataclass
class RateLimiter:
    """Rate limiter with token bucket algorithm"""
    requests_per_second: float = 1.0
    burst_size: int = 5
    _tokens: float = field(default=5.0, repr=False)
    _last_update: datetime = field(default_factory=datetime.now, repr=False)
    _lock: asyncio.Lock = field(default_factory=asyncio.Lock, repr=False)
    
    async def acquire(self):
        """Acquire a token, waiting if necessary"""
        async with self._lock:
            now = datetime.now()
            time_passed = (now - self._last_update).total_seconds()
            self._tokens = min(
                self.burst_size,
                self._tokens + time_passed * self.requests_per_second
            )
            self._last_update = now
            
            if self._tokens < 1:
                wait_time = (1 - self._tokens) / self.requests_per_second
                await asyncio.sleep(wait_time)
                self._tokens = 0
            else:
                self._tokens -= 1


class ContentOrchestrator:
    """
    Main orchestrator for the content aggregation system.
    Manages scrapers, handles scheduling, and coordinates with Supabase.
    """
    
    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.tasks: List[ScraperTask] = []
        self.task_queue: List[tuple] = []  # Priority queue
        self.completed_tasks: List[ScraperTask] = []
        self.failed_tasks: List[ScraperTask] = []
        
        # Rate limiters per domain
        self.rate_limiters: Dict[str, RateLimiter] = {}
        
        # Statistics
        self.stats = {
            'total_tasks': 0,
            'successful': 0,
            'failed': 0,
            'retried': 0,
            'items_scraped': 0,
            'start_time': None,
            'end_time': None
        }
        
        # Supabase
        self.supabase: Optional[Client] = None
        if HAS_SUPABASE and supabase_url and supabase_key:
            try:
                self.supabase = create_client(supabase_url, supabase_key)
                logger.info("✅ Connected to Supabase")
            except Exception as e:
                logger.error(f"❌ Supabase connection failed: {e}")
        
        # Session for HTTP requests
        self.session: Optional[aiohttp.ClientSession] = None
        
        # Running flag
        self.is_running = False
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            headers={
                "User-Agent": "PPSDM-KMITS-ContentBot/4.0 (Educational Content Aggregator)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "id,en-US;q=0.9,en;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "DNT": "1",
                "Connection": "keep-alive",
            },
            timeout=aiohttp.ClientTimeout(total=30)
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    def get_rate_limiter(self, domain: str) -> RateLimiter:
        """Get or create rate limiter for domain"""
        if domain not in self.rate_limiters:
            # Different limits for different domains
            if 'its.ac.id' in domain:
                self.rate_limiters[domain] = RateLimiter(requests_per_second=0.5, burst_size=3)
            elif 'youtube.com' in domain or 'googleapis.com' in domain:
                self.rate_limiters[domain] = RateLimiter(requests_per_second=2.0, burst_size=10)
            elif 'github.com' in domain:
                self.rate_limiters[domain] = RateLimiter(requests_per_second=1.0, burst_size=5)
            else:
                self.rate_limiters[domain] = RateLimiter(requests_per_second=1.0, burst_size=3)
        
        return self.rate_limiters[domain]
    
    def add_task(self, task: ScraperTask):
        """Add a task to the queue"""
        self.tasks.append(task)
        heapq.heappush(self.task_queue, (task.priority.value, time.time(), task))
        self.stats['total_tasks'] += 1
        logger.info(f"📋 Added task: {task.name} (Priority: {task.priority.name})")
    
    def add_scraper(
        self,
        name: str,
        scraper_func: Callable,
        priority: ScraperPriority = ScraperPriority.MEDIUM,
        source_id: Optional[str] = None,
        config: Dict = None,
        **kwargs
    ):
        """Convenience method to add a scraper"""
        task = ScraperTask(
            id=f"{name}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1000, 9999)}",
            name=name,
            priority=priority,
            scraper_func=scraper_func,
            source_id=source_id,
            config=config or {},
            **kwargs
        )
        self.add_task(task)
        return task
    
    async def execute_task(self, task: ScraperTask) -> Dict:
        """Execute a single scraper task with retry logic"""
        task.status = ScraperStatus.RUNNING
        task.started_at = datetime.now()
        
        logger.info(f"🚀 Starting: {task.name}")
        
        # Log to Supabase
        log_id = await self._log_scraper_start(task)
        
        try:
            # Apply rate limiting
            domain = task.config.get('domain', 'default')
            rate_limiter = self.get_rate_limiter(domain)
            await rate_limiter.acquire()
            
            # Execute scraper
            result = await asyncio.wait_for(
                task.scraper_func(self.session, task.config),
                timeout=task.timeout_seconds
            )
            
            # Success
            task.status = ScraperStatus.SUCCESS
            task.result = result
            task.completed_at = datetime.now()
            
            self.stats['successful'] += 1
            self.stats['items_scraped'] += result.get('items_count', 0)
            
            logger.info(f"✅ Completed: {task.name} ({result.get('items_count', 0)} items)")
            
            # Update log
            await self._log_scraper_complete(log_id, task, result)
            
            return result
            
        except asyncio.TimeoutError:
            error_msg = f"Timeout after {task.timeout_seconds}s"
            return await self._handle_task_error(task, error_msg, log_id, is_timeout=True)
            
        except Exception as e:
            error_msg = str(e)
            return await self._handle_task_error(task, error_msg, log_id)
    
    async def _handle_task_error(
        self,
        task: ScraperTask,
        error_msg: str,
        log_id: Optional[str] = None,
        is_timeout: bool = False
    ) -> Dict:
        """Handle task error with retry logic"""
        task.retry_count += 1
        
        if task.retry_count <= task.max_retries:
            # Retry
            task.status = ScraperStatus.RETRYING
            self.stats['retried'] += 1
            
            # Exponential backoff
            backoff = (2 ** task.retry_count) + random.uniform(0, 1)
            logger.warning(f"⚠️ {task.name} failed (attempt {task.retry_count}/{task.max_retries}): {error_msg}")
            logger.info(f"⏳ Retrying in {backoff:.1f}s...")
            
            await asyncio.sleep(backoff)
            
            # Re-add to queue with same priority
            heapq.heappush(self.task_queue, (task.priority.value, time.time(), task))
            
            return {'status': 'retrying', 'error': error_msg}
        
        else:
            # Max retries reached
            task.status = ScraperStatus.FAILED
            task.error = error_msg
            task.completed_at = datetime.now()
            
            self.stats['failed'] += 1
            self.failed_tasks.append(task)
            
            logger.error(f"❌ Failed: {task.name} after {task.max_retries} retries: {error_msg}")
            
            # Update log
            await self._log_scraper_complete(log_id, task, {'error': error_msg})
            
            return {'status': 'failed', 'error': error_msg}
    
    async def _log_scraper_start(self, task: ScraperTask) -> Optional[str]:
        """Log scraper start to Supabase"""
        if not self.supabase:
            return None
        
        try:
            data = {
                'scraper_name': task.name,
                'source_id': task.source_id,
                'status': 'started',
                'started_at': task.started_at.isoformat(),
                'run_type': 'scheduled',
                'trigger_source': 'orchestrator'
            }
            
            result = self.supabase.table('scraper_logs').insert(data).execute()
            return result.data[0]['id'] if result.data else None
            
        except Exception as e:
            logger.error(f"Failed to log scraper start: {e}")
            return None
    
    async def _log_scraper_complete(
        self,
        log_id: Optional[str],
        task: ScraperTask,
        result: Dict
    ):
        """Log scraper completion to Supabase"""
        if not self.supabase or not log_id:
            return
        
        try:
            data = {
                'status': task.status.value,
                'completed_at': task.completed_at.isoformat() if task.completed_at else None,
                'items_scraped': result.get('items_count', 0),
                'items_new': result.get('new_items', 0),
                'items_failed': result.get('failed_items', 0),
                'error_message': task.error if task.status == ScraperStatus.FAILED else None,
                'error_details': json.dumps({'result': result}) if task.error else None
            }
            
            self.supabase.table('scraper_logs').update(data).eq('id', log_id).execute()
            
        except Exception as e:
            logger.error(f"Failed to log scraper completion: {e}")
    
    async def run_all(self, max_concurrent: int = 3):
        """Run all tasks in the queue with concurrency control"""
        self.is_running = True
        self.stats['start_time'] = datetime.now()
        
        logger.info(f"🎬 Starting orchestrator with {len(self.tasks)} tasks (max concurrent: {max_concurrent})")
        
        # Semaphore for concurrency control
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def run_with_semaphore(task: ScraperTask):
            async with semaphore:
                return await self.execute_task(task)
        
        # Process queue
        tasks_to_run = []
        while self.task_queue:
            _, _, task = heapq.heappop(self.task_queue)
            if task.status in [ScraperStatus.PENDING, ScraperStatus.RETRYING]:
                tasks_to_run.append(run_with_semaphore(task))
        
        # Execute all tasks
        if tasks_to_run:
            results = await asyncio.gather(*tasks_to_run, return_exceptions=True)
            
            # Process results
            for task, result in zip([t for t in self.tasks if t.status in [ScraperStatus.PENDING, ScraperStatus.RETRYING]], results):
                if isinstance(result, Exception):
                    logger.error(f"Task {task.name} raised exception: {result}")
                    task.status = ScraperStatus.FAILED
                    task.error = str(result)
                    self.failed_tasks.append(task)
        
        self.is_running = False
        self.stats['end_time'] = datetime.now()
        
        # Print summary
        self._print_summary()
        
        return self.stats
    
    def _print_summary(self):
        """Print execution summary"""
        duration = (self.stats['end_time'] - self.stats['start_time']).total_seconds()
        
        print("\n" + "="*60)
        print("📊 SCRAPER ORCHESTRATOR SUMMARY")
        print("="*60)
        print(f"Duration: {duration:.1f}s")
        print(f"Total Tasks: {self.stats['total_tasks']}")
        print(f"Successful: {self.stats['successful']} ✅")
        print(f"Failed: {self.stats['failed']} ❌")
        print(f"Retried: {self.stats['retried']} 🔄")
        print(f"Items Scraped: {self.stats['items_scraped']} 📦")
        print("="*60)
        
        if self.failed_tasks:
            print("\n❌ Failed Tasks:")
            for task in self.failed_tasks:
                print(f"  - {task.name}: {task.error}")
        
        logger.info(f"Orchestrator completed in {duration:.1f}s")
    
    async def run_continuous(self, interval_minutes: int = 360):
        """Run scrapers continuously with interval"""
        logger.info(f"🔄 Starting continuous mode (interval: {interval_minutes}min)")
        
        while True:
            try:
                await self.run_all()
                
                # Reset for next run
                self.tasks = []
                self.task_queue = []
                self.completed_tasks = []
                self.failed_tasks = []
                self.stats = {
                    'total_tasks': 0,
                    'successful': 0,
                    'failed': 0,
                    'retried': 0,
                    'items_scraped': 0,
                    'start_time': None,
                    'end_time': None
                }
                
                logger.info(f"⏳ Sleeping for {interval_minutes} minutes...")
                await asyncio.sleep(interval_minutes * 60)
                
            except KeyboardInterrupt:
                logger.info("🛑 Stopping continuous mode...")
                break
            except Exception as e:
                logger.error(f"Error in continuous mode: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying
    
    def get_health_status(self) -> Dict:
        """Get current health status of the orchestrator"""
        return {
            'is_running': self.is_running,
            'queue_size': len(self.task_queue),
            'completed': len(self.completed_tasks),
            'failed': len(self.failed_tasks),
            'stats': self.stats,
            'rate_limiters': {
                domain: {
                    'tokens': limiter._tokens,
                    'requests_per_second': limiter.requests_per_second
                }
                for domain, limiter in self.rate_limiters.items()
            }
        }


# ============================================================================
# EXAMPLE SCRAPER FUNCTIONS
# ============================================================================

async def example_its_scraper(session: aiohttp.ClientSession, config: Dict) -> Dict:
    """Example ITS scraper"""
    # This would be replaced with actual ITS scraping logic
    await asyncio.sleep(1)  # Simulate work
    return {
        'items_count': 10,
        'new_items': 5,
        'failed_items': 0,
        'source': 'ITS'
    }


async def example_youtube_scraper(session: aiohttp.ClientSession, config: Dict) -> Dict:
    """Example YouTube scraper"""
    await asyncio.sleep(2)  # Simulate work
    return {
        'items_count': 20,
        'new_items': 15,
        'failed_items': 0,
        'source': 'YouTube'
    }


async def example_job_scraper(session: aiohttp.ClientSession, config: Dict) -> Dict:
    """Example job portal scraper"""
    await asyncio.sleep(1.5)  # Simulate work
    return {
        'items_count': 30,
        'new_items': 25,
        'failed_items': 0,
        'source': 'Job Portal'
    }


# ============================================================================
# MAIN EXECUTION
# ============================================================================

async def main():
    """Main execution function"""
    # Get Supabase credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    async with ContentOrchestrator(supabase_url, supabase_key) as orchestrator:
        # Add scrapers with different priorities
        
        # Critical: ITS official content
        orchestrator.add_scraper(
            name="ITS_News",
            scraper_func=example_its_scraper,
            priority=ScraperPriority.CRITICAL,
            config={'domain': 'its.ac.id'},
            delay_seconds=3
        )
        
        # High: Job portals
        orchestrator.add_scraper(
            name="Kalibrr_Jobs",
            scraper_func=example_job_scraper,
            priority=ScraperPriority.HIGH,
            config={'domain': 'kalibrr.com'},
            delay_seconds=2
        )
        
        orchestrator.add_scraper(
            name="Glints_Jobs",
            scraper_func=example_job_scraper,
            priority=ScraperPriority.HIGH,
            config={'domain': 'glints.com'},
            delay_seconds=2
        )
        
        # Medium: YouTube educational
        orchestrator.add_scraper(
            name="YouTube_EDU",
            scraper_func=example_youtube_scraper,
            priority=ScraperPriority.MEDIUM,
            config={'domain': 'youtube.com'},
            delay_seconds=1
        )
        
        # Run all scrapers
        stats = await orchestrator.run_all(max_concurrent=3)
        
        return stats


if __name__ == "__main__":
    # Run the orchestrator
    asyncio.run(main())
