"""
RSS Aggregator v2.0 - Infinite Learning Factory
================================================
Enhanced with rate limiting, retry, and quality filtering.
"""

import os
import sys
import hashlib
import logging
import random
import time
from datetime import datetime
from typing import List, Dict, Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import feedparser
from dotenv import load_dotenv
from supabase import create_client, Client

try:
    from utils.rate_limiter import rate_limiter
    from utils.retry_handler import retry, RetryConfig
    from utils.monitoring import monitor_errors
    from utils.sanitizer import sanitize_text, strip_html_tags
except ImportError:
    def retry(*a, **k):
        def d(f): return f
        return d
    def monitor_errors(*a, **k):
        def d(f): return f
        return d

load_dotenv('.env.local')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Educational RSS feeds
RSS_FEEDS = [
    # Indonesian Education
    {"url": "https://edukasi.kompas.com/rss", "dimension": "cognitive", "lang": "id"},
    {"url": "https://www.cnnindonesia.com/gaya-hidup/rss", "dimension": "physical", "lang": "id"},
    {"url": "https://health.detik.com/rss", "dimension": "physical", "lang": "id"},
    # Self Development
    {"url": "https://medium.com/feed/tag/self-improvement", "dimension": "self_management", "lang": "en"},
    {"url": "https://medium.com/feed/tag/productivity", "dimension": "self_management", "lang": "en"},
    {"url": "https://medium.com/feed/tag/mental-health", "dimension": "mental_health", "lang": "en"},
    # Financial
    {"url": "https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_articles", "dimension": "financial", "lang": "en"},
    # Science & Tech
    {"url": "https://www.sciencedaily.com/rss/all.xml", "dimension": "cognitive", "lang": "en"},
    {"url": "https://phys.org/rss-feed/", "dimension": "cognitive", "lang": "en"},
]


class RSSAggregator:
    """RSS content harvester with rate limiting."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.stats = {'feeds': 0, 'items': 0, 'saved': 0, 'errors': 0, 'duplicates': 0}
    
    def _rate_limit(self):
        """Apply rate limiting with jitter."""
        delay = random.uniform(1.5, 4.0)
        time.sleep(delay)
    
    def _hash_content(self, url: str, title: str) -> str:
        """Generate content hash."""
        return hashlib.md5(f"{url}:{title}".encode()).hexdigest()
    
    def _is_duplicate(self, external_id: str) -> bool:
        """Check for duplicates."""
        try:
            result = self.supabase.table('raw_materials').select('id').eq(
                'external_id', external_id
            ).execute()
            return len(result.data) > 0
        except:
            return False
    
    def _clean_content(self, entry: Dict) -> str:
        """Extract and clean content from entry."""
        content = ""
        
        # Try content first
        if hasattr(entry, 'content') and entry.content:
            content = entry.content[0].get('value', '')
        
        # Fallback to summary
        if not content and hasattr(entry, 'summary'):
            content = entry.summary
        
        # Fallback to description
        if not content and hasattr(entry, 'description'):
            content = entry.description
        
        # Clean HTML
        content = strip_html_tags(content)
        content = sanitize_text(content)
        
        return content
    
    @retry(config=RetryConfig(max_retries=3, initial_delay=2.0))
    @monitor_errors('rss_aggregator')
    def fetch_feed(self, feed_config: Dict) -> List[Dict]:
        """Fetch and parse a single RSS feed."""
        self._rate_limit()
        self.stats['feeds'] += 1
        
        url = feed_config['url']
        logger.info(f"📡 Fetching: {url[:60]}...")
        
        try:
            feed = feedparser.parse(url)
            
            if feed.bozo:
                logger.warning(f"Feed parse warning: {feed.bozo_exception}")
            
            entries = []
            for entry in feed.entries[:15]:  # Max 15 per feed
                self.stats['items'] += 1
                
                # Generate external ID
                link = getattr(entry, 'link', '') or ''
                title = getattr(entry, 'title', 'Untitled') or 'Untitled'
                external_id = f"rss_{self._hash_content(link, title)}"
                
                # Check duplicate
                if self._is_duplicate(external_id):
                    self.stats['duplicates'] += 1
                    continue
                
                # Extract content
                content = self._clean_content(entry)
                if len(content) < 100:
                    continue
                
                # Parse date
                published = None
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    try:
                        published = datetime(*entry.published_parsed[:6]).isoformat()
                    except:
                        pass
                
                entries.append({
                    'external_id': external_id,
                    'title': title[:500],
                    'content': content,
                    'url': link,
                    'published_at': published,
                    'language': feed_config.get('lang', 'en'),
                    'detected_dimension': feed_config.get('dimension', 'cognitive'),
                    'content_hash': self._hash_content(link, content[:500]),
                    'metadata': {
                        'feed_url': url,
                        'author': getattr(entry, 'author', None),
                        'tags': [t.term for t in getattr(entry, 'tags', [])][:5]
                    }
                })
            
            return entries
            
        except Exception as e:
            logger.error(f"Feed fetch failed: {e}")
            self.stats['errors'] += 1
            return []
    
    def _get_or_create_source(self, feed_config: Dict) -> str:
        """Get or create source ID for feed."""
        try:
            result = self.supabase.table('content_sources').select('id').eq(
                'url', feed_config['url']
            ).execute()
            
            if result.data:
                return result.data[0]['id']
            
            new_source = {
                'name': f"RSS: {feed_config['url'][:50]}",
                'source_type': 'rss',
                'url': feed_config['url'],
                'primary_dimension': feed_config.get('dimension', 'cognitive'),
                'is_active': True,
                'fetch_frequency_hours': 6,
            }
            
            result = self.supabase.table('content_sources').insert(new_source).execute()
            return result.data[0]['id']
        except:
            return None
    
    def save_entries(self, entries: List[Dict], feed_config: Dict) -> int:
        """Save entries to database."""
        source_id = self._get_or_create_source(feed_config)
        saved = 0
        
        for entry in entries:
            try:
                entry['source_id'] = source_id
                self.supabase.table('raw_materials').insert(entry).execute()
                saved += 1
                self.stats['saved'] += 1
            except Exception as e:
                logger.debug(f"Save failed: {e}")
        
        return saved
    
    def run(self, feeds: Optional[List[Dict]] = None) -> Dict:
        """Run the RSS aggregator."""
        logger.info("=" * 60)
        logger.info("📰 RSS AGGREGATOR v2.0")
        logger.info("=" * 60)
        
        feeds_to_process = feeds or RSS_FEEDS
        
        for feed in feeds_to_process:
            entries = self.fetch_feed(feed)
            if entries:
                saved = self.save_entries(entries, feed)
                logger.info(f"  ✓ Saved {saved}/{len(entries)} from {feed['url'][:40]}...")
        
        logger.info("=" * 60)
        logger.info(f"📊 SUMMARY: {self.stats}")
        logger.info("=" * 60)
        
        return self.stats


def main():
    aggregator = RSSAggregator()
    aggregator.run()


if __name__ == "__main__":
    main()
