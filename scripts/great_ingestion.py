#!/usr/bin/env python3
"""
GREAT INGESTION - PPSDM KMITS Batch Processor
=============================================
Processes all 100+ ebooks with auto-retry, real-time monitoring,
and Google Drive verification.

Usage:
    python scripts/great_ingestion.py --mode=full --parallel=5
    python scripts/great_ingestion.py --mode=retry-failed
    python scripts/great_ingestion.py --verify-drive

Author: PPSDM KMITS Team
Version: 1.0.0
"""

import os
import sys
import json
import time
import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse
from contextlib import contextmanager
import signal

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('great_ingestion.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('GreatIngestion')

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

# Constants
BATCH_SIZE = 5
MAX_RETRIES = 3
RETRY_DELAY = 5  # seconds
REQUEST_TIMEOUT = 120  # seconds
RATE_LIMIT_GROQ = 20  # requests per minute (free tier)
RATE_LIMIT_OPENROUTER = 10  # requests per minute

@dataclass
class ProcessingJob:
    """Represents a single ebook processing job"""
    ebook_id: str
    title: str
    author: str
    content_type: str
    status: str = 'pending'
    attempts: int = 0
    error_message: Optional[str] = None
    result: Optional[Dict] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    processing_time_ms: int = 0
    ai_provider: str = ''
    
    def to_dict(self) -> Dict:
        return {
            'ebook_id': self.ebook_id,
            'title': self.title,
            'content_type': self.content_type,
            'status': self.status,
            'attempts': self.attempts,
            'error_message': self.error_message,
            'processing_time_ms': self.processing_time_ms,
            'ai_provider': self.ai_provider
        }

@dataclass
class ProcessingStats:
    """Statistics for the batch processing"""
    total_jobs: int = 0
    completed: int = 0
    failed: int = 0
    in_progress: int = 0
    pending: int = 0
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    
    @property
    def success_rate(self) -> float:
        if self.total_jobs == 0:
            return 0.0
        return (self.completed / self.total_jobs) * 100
    
    @property
    def elapsed_time(self) -> timedelta:
        if not self.start_time:
            return timedelta(0)
        end = self.end_time or datetime.now()
        return end - self.start_time
    
    def to_dict(self) -> Dict:
        return {
            'total_jobs': self.total_jobs,
            'completed': self.completed,
            'failed': self.failed,
            'in_progress': self.in_progress,
            'pending': self.pending,
            'success_rate': f'{self.success_rate:.2f}%',
            'elapsed_time': str(self.elapsed_time)
        }

class RateLimiter:
    """Rate limiter for API calls"""
    def __init__(self, max_requests: int, time_window: int = 60):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
        self.lock = asyncio.Lock()
    
    async def acquire(self):
        async with self.lock:
            now = time.time()
            # Remove old requests outside the time window
            self.requests = [req for req in self.requests if now - req < self.time_window]
            
            if len(self.requests) >= self.max_requests:
                # Wait until the oldest request is outside the window
                sleep_time = self.time_window - (now - self.requests[0]) + 0.1
                logger.info(f'Rate limit reached, sleeping for {sleep_time:.2f}s')
                await asyncio.sleep(sleep_time)
                self.requests = self.requests[1:]
            
            self.requests.append(time.time())

class GreatIngestion:
    """Main batch processor for ebook ingestion"""
    
    CONTENT_TYPES = [
        'summary',
        'deep_dive',
        'action_plan',
        'audio_script',
        'gamification',
        'presentation',
        'podcast_script',
        'scenarios',
        'infographic'
    ]
    
    def __init__(self):
        self.stats = ProcessingStats()
        self.jobs: List[ProcessingJob] = []
        self.groq_limiter = RateLimiter(RATE_LIMIT_GROQ)
        self.openrouter_limiter = RateLimiter(RATE_LIMIT_OPENROUTER)
        self.running = False
        self.session: Optional[aiohttp.ClientSession] = None
        
        # Create output directory
        self.output_dir = Path('great_ingestion_output')
        self.output_dir.mkdir(exist_ok=True)
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully"""
        logger.info('Shutdown signal received, finishing current batch...')
        self.running = False
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            headers={'Content-Type': 'application/json'}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def fetch_ebooks_from_supabase(self) -> List[Dict]:
        """Fetch unprocessed ebooks from Supabase"""
        logger.info('Fetching ebooks from Supabase...')
        
        url = f'{SUPABASE_URL}/rest/v1/ebooks'
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}'
        }
        params = {
            'select': '*',
            'is_processed': 'eq.false',
            'order': 'created_at.asc'
        }
        
        try:
            async with self.session.get(url, headers=headers, params=params) as response:
                if response.status == 200:
                    ebooks = await response.json()
                    logger.info(f'Found {len(ebooks)} unprocessed ebooks')
                    return ebooks
                else:
                    error_text = await response.text()
                    logger.error(f'Supabase error: {error_text}')
                    return []
        except Exception as e:
            logger.error(f'Error fetching ebooks: {e}')
            return []
    
    def generate_content_prompt(self, ebook: Dict, content_type: str) -> str:
        """Generate AI prompt for specific content type"""
        
        base_prompt = f"""Create {content_type.replace('_', ' ')} for the book "{ebook['title']}" by {ebook['author']}.

Book Description: {ebook.get('description', 'N/A')}
Category: {ebook.get('category', 'General')}
Difficulty: {ebook.get('difficulty_level', 'Intermediate')}

"""
        
        prompts = {
            'summary': base_prompt + """Provide a comprehensive summary in the following JSON format:
{
  "overview": "Brief overview (2-3 sentences)",
  "key_points": ["Point 1", "Point 2", "Point 3"],
  "main_takeaways": ["Takeaway 1", "Takeaway 2"],
  "target_audience": "Who should read this",
  "reading_time": "Estimated time in minutes"
}""",
            
            'deep_dive': base_prompt + """Provide deep analysis in the following JSON format:
{
  "core_concepts": [{"concept": "Name", "explanation": "Detailed explanation"}],
  "practical_applications": ["Application 1", "Application 2"],
  "case_studies": [{"title": "Case name", "summary": "Brief description"}],
  "critical_analysis": "Critical evaluation of the content",
  "comparison": "How this compares to similar works"
}""",
            
            'action_plan': base_prompt + """Create actionable plan in the following JSON format:
{
  "immediate_actions": [{"action": "What to do", "timeframe": "When", "expected_outcome": "Result"}],
  "short_term_goals": [{"goal": "Goal name", "deadline": "Timeframe", "steps": ["Step 1"]}],
  "long_term_goals": [{"goal": "Goal name", "timeline": "Duration", "milestones": ["Milestone 1"]}],
  "tracking_metrics": ["Metric 1", "Metric 2"],
  "habit_formations": [{"habit": "Habit name", "frequency": "How often", "reminder": "When to do"}]
}""",
            
            'gamification': base_prompt + """Create gamification elements in the following JSON format:
{
  "challenges": [{"name": "Challenge name", "description": "What to do", "points": 100, "difficulty": "easy|medium|hard"}],
  "achievements": [{"name": "Achievement", "criteria": "How to unlock", "badge_icon": "Description"}],
  "progression_levels": [{"level": 1, "name": "Level name", "xp_required": 100, "rewards": ["Reward 1"]}],
  "leaderboards": [{"category": "Category name", "metric": "What to measure"}],
  "quests": [{"title": "Quest name", "objectives": ["Objective 1"], "reward": "What you get"}]
}""",
            
            'presentation': base_prompt + """Create presentation outline in the following JSON format:
{
  "title": "Presentation title",
  "slides": [
    {
      "slide_number": 1,
      "title": "Slide title",
      "content": ["Bullet point 1", "Bullet point 2"],
      "speaker_notes": "What to say",
      "visual_suggestion": "What image/chart to use"
    }
  ],
  "total_slides": 10,
  "estimated_duration": "Duration in minutes",
  "key_quotes": ["Quote 1", "Quote 2"]
}""",
            
            'audio_script': base_prompt + """Create audio/podcast script in the following JSON format:
{
  "title": "Audio title",
  "duration": "Duration in minutes",
  "format": "interview|monologue|discussion",
  "script_segments": [
    {
      "timestamp": "00:00",
      "speaker": "Narrator|Host|Guest",
      "text": "What to say",
      "tone": "enthusiastic|calm|informative"
    }
  ],
  "intro_music": "Suggested music style",
  "outro": "Closing remarks"
}""",
            
            'podcast_script': base_prompt + """Create podcast episode script in the following JSON format:
{
  "episode_title": "Episode name",
  "episode_number": 1,
  "duration": "Duration in minutes",
  "hosts": ["Host 1", "Host 2"],
  "segments": [
    {
      "type": "intro|discussion|interview|outro",
      "speaker": "Who speaks",
      "content": "What they say",
      "duration": "Time in minutes"
    }
  ],
  "topics_covered": ["Topic 1", "Topic 2"],
  "key_questions": ["Question 1?", "Question 2?"]
}""",
            
            'scenarios': base_prompt + """Create interactive scenarios in the following JSON format:
{
  "scenarios": [
    {
      "id": "scenario_1",
      "title": "Scenario title",
      "context": "Background situation",
      "situation": "What happens",
      "choices": [
        {
          "id": "A",
          "text": "Option A description",
          "outcome": "What happens if chosen",
          "feedback": "Why this is good/bad",
          "points": 10
        }
      ],
      "learning_objective": "What user learns from this"
    }
  ],
  "total_scenarios": 5,
  "difficulty_progression": "How difficulty increases"
}""",
            
            'infographic': base_prompt + """Create infographic design brief in the following JSON format:
{
  "title": "Infographic title",
  "dimensions": {"width": 1080, "height": 1920},
  "color_scheme": {
    "primary": "#RRGGBB",
    "secondary": "#RRGGBB",
    "accent": "#RRGGBB",
    "background": "#RRGGBB"
  },
  "sections": [
    {
      "section_number": 1,
      "type": "header|statistic|timeline|comparison|quote",
      "content": "What to display",
      "visual_element": "Icon|Chart|Illustration description",
      "position": {"x": 0, "y": 0}
    }
  ],
  "key_statistics": [{"value": "Number", "label": "What it means", "source": "Source"}],
  "fonts": ["Heading font", "Body font"]
}"""
        }
        
        return prompts.get(content_type, base_prompt + 'Provide detailed content in JSON format.')
    
    async def call_groq(self, prompt: str) -> Optional[Dict]:
        """Call Groq API for content generation"""
        await self.groq_limiter.acquire()
        
        url = 'https://api.groq.com/openai/v1/chat/completions'
        headers = {
            'Authorization': f'Bearer {GROQ_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'llama-3.1-70b-versatile',
            'messages': [
                {'role': 'system', 'content': 'You are a content generation expert. Always respond with valid JSON.'},
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.7,
            'max_tokens': 4000,
            'response_format': {'type': 'json_object'}
        }
        
        try:
            async with self.session.post(url, headers=headers, json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    content = data['choices'][0]['message']['content']
                    return {
                        'content': json.loads(content),
                        'tokens_used': data['usage']['total_tokens'],
                        'provider': 'groq'
                    }
                else:
                    error_text = await response.text()
                    logger.error(f'Groq API error: {error_text}')
                    return None
        except Exception as e:
            logger.error(f'Error calling Groq: {e}')
            return None
    
    async def call_openrouter(self, prompt: str) -> Optional[Dict]:
        """Call OpenRouter API as fallback"""
        await self.openrouter_limiter.acquire()
        
        url = 'https://openrouter.ai/api/v1/chat/completions'
        headers = {
            'Authorization': f'Bearer {OPENROUTER_API_KEY}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://ppsdm-kmits.vercel.app',
            'X-Title': 'PPSDM KMITS Great Ingestion'
        }
        
        payload = {
            'model': 'mistralai/mistral-7b-instruct',
            'messages': [
                {'role': 'system', 'content': 'You are a content generation expert. Always respond with valid JSON.'},
                {'role': 'user', 'content': prompt}
            ],
            'temperature': 0.7,
            'max_tokens': 4000
        }
        
        try:
            async with self.session.post(url, headers=headers, json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    content = data['choices'][0]['message']['content']
                    # Try to extract JSON from markdown code blocks if present
                    if '```json' in content:
                        content = content.split('```json')[1].split('```')[0]
                    elif '```' in content:
                        content = content.split('```')[1].split('```')[0]
                    return {
                        'content': json.loads(content.strip()),
                        'tokens_used': data['usage']['total_tokens'],
                        'provider': 'openrouter'
                    }
                else:
                    error_text = await response.text()
                    logger.error(f'OpenRouter API error: {error_text}')
                    return None
        except Exception as e:
            logger.error(f'Error calling OpenRouter: {e}')
            return None
    
    async def generate_content(self, job: ProcessingJob) -> bool:
        """Generate content for a specific job with retry logic"""
        prompt = self.generate_content_prompt({'title': job.title, 'author': 'Unknown'}, job.content_type)
        
        for attempt in range(1, MAX_RETRIES + 1):
            job.attempts = attempt
            job.started_at = datetime.now()
            
            # Try Groq first
            result = await self.call_groq(prompt)
            
            # Fallback to OpenRouter
            if not result:
                logger.info(f'Groq failed, trying OpenRouter for {job.title}')
                result = await self.call_openrouter(prompt)
            
            if result:
                job.result = result['content']
                job.ai_provider = result['provider']
                job.processing_time_ms = int((datetime.now() - job.started_at).total_seconds() * 1000)
                job.status = 'completed'
                job.completed_at = datetime.now()
                return True
            
            if attempt < MAX_RETRIES:
                logger.warning(f'Attempt {attempt} failed for {job.title}, retrying in {RETRY_DELAY}s...')
                await asyncio.sleep(RETRY_DELAY * attempt)
        
        job.status = 'failed'
        job.error_message = f'Failed after {MAX_RETRIES} attempts'
        job.completed_at = datetime.now()
        return False
    
    async def save_to_supabase(self, job: ProcessingJob) -> bool:
        """Save processed content to Supabase"""
        url = f'{SUPABASE_URL}/rest/v1/ebook_content'
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        payload = {
            'ebook_id': job.ebook_id,
            'content_type': job.content_type,
            'content': job.result,
            'ai_provider': job.ai_provider,
            'processing_time_ms': job.processing_time_ms
        }
        
        try:
            async with self.session.post(url, headers=headers, json=payload) as response:
                if response.status in [200, 201]:
                    return True
                else:
                    error_text = await response.text()
                    logger.error(f'Supabase save error: {error_text}')
                    return False
        except Exception as e:
            logger.error(f'Error saving to Supabase: {e}')
            return False
    
    async def update_ebook_status(self, ebook_id: str, is_processed: bool = True) -> bool:
        """Update ebook processing status"""
        url = f'{SUPABASE_URL}/rest/v1/ebooks'
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json'
        }
        
        params = {'id': f'eq.{ebook_id}'}
        payload = {
            'is_processed': is_processed,
            'processing_status': 'completed' if is_processed else 'failed',
            'updated_at': datetime.now().isoformat()
        }
        
        try:
            async with self.session.patch(url, headers=headers, params=params, json=payload) as response:
                return response.status in [200, 204]
        except Exception as e:
            logger.error(f'Error updating ebook status: {e}')
            return False
    
    async def process_single_ebook(self, ebook: Dict) -> List[ProcessingJob]:
        """Process all content types for a single ebook"""
        jobs = []
        
        for content_type in self.CONTENT_TYPES:
            job = ProcessingJob(
                ebook_id=ebook['id'],
                title=ebook['title'],
                author=ebook.get('author', 'Unknown'),
                content_type=content_type
            )
            jobs.append(job)
        
        for job in jobs:
            if not self.running:
                break
            
            self.stats.in_progress += 1
            logger.info(f'Processing {job.title} - {job.content_type}')
            
            success = await self.generate_content(job)
            
            if success:
                await self.save_to_supabase(job)
                self.stats.completed += 1
            else:
                self.stats.failed += 1
            
            self.stats.in_progress -= 1
            await self.save_progress_report()
        
        all_success = all(job.status == 'completed' for job in jobs)
        await self.update_ebook_status(ebook['id'], all_success)
        
        return jobs
    
    async def process_batch(self, ebooks: List[Dict], max_parallel: int = 3):
        """Process ebooks in parallel batches"""
        self.stats.total_jobs = len(ebooks) * len(self.CONTENT_TYPES)
        self.stats.pending = self.stats.total_jobs
        self.stats.start_time = datetime.now()
        self.running = True
        
        logger.info(f'Starting batch: {len(ebooks)} ebooks, {self.stats.total_jobs} jobs')
        
        semaphore = asyncio.Semaphore(max_parallel)
        
        async def process_with_semaphore(ebook):
            async with semaphore:
                if not self.running:
                    return []
                return await self.process_single_ebook(ebook)
        
        tasks = [process_with_semaphore(ebook) for ebook in ebooks]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, list):
                self.jobs.extend(result)
        
        self.stats.end_time = datetime.now()
        self.running = False
        
        await self.save_progress_report()
        self.save_final_report()
    
    async def save_progress_report(self):
        """Save current progress"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'stats': self.stats.to_dict(),
            'recent_jobs': [job.to_dict() for job in self.jobs[-20:]]
        }
        
        report_file = self.output_dir / 'progress_report.json'
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
    
    def save_final_report(self):
        """Save final report"""
        report = {
            'start_time': self.stats.start_time.isoformat() if self.stats.start_time else None,
            'end_time': self.stats.end_time.isoformat() if self.stats.end_time else None,
            'stats': self.stats.to_dict(),
            'jobs': [job.to_dict() for job in self.jobs],
            'failed_jobs': [job.to_dict() for job in self.jobs if job.status == 'failed']
        }
        
        report_file = self.output_dir / f'report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f'Report saved: {report_file}')
        logger.info(f'Success rate: {self.stats.success_rate:.2f}%')

async def main():
    parser = argparse.ArgumentParser(description='Great Ingestion Processor')
    parser.add_argument('--mode', choices=['full', 'retry', 'verify'], default='full')
    parser.add_argument('--parallel', type=int, default=3)
    parser.add_argument('--limit', type=int, default=100)
    
    args = parser.parse_args()
    
    async with GreatIngestion() as processor:
        if args.mode == 'verify':
            result = await processor.verify_drive_integration()
            print(json.dumps(result, indent=2))
        else:
            ebooks = await processor.fetch_ebooks_from_supabase()
            if not ebooks:
                logger.error('No ebooks found')
                return
            
            if args.limit:
                ebooks = ebooks[:args.limit]
            
            await processor.process_batch(ebooks, max_parallel=args.parallel)

if __name__ == '__main__':
    asyncio.run(main())