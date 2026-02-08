"""
Academic Harvester v2.0 - Infinite Learning Factory
====================================================
Enhanced with rate limiting, retry, and Indonesian research.
"""

import os
import sys
import hashlib
import logging
import time
from datetime import datetime
from typing import List, Dict, Optional
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

try:
    from utils.rate_limiter import rate_limiter, wait_for_arxiv
    from utils.retry_handler import retry, RetryConfig
    from utils.monitoring import monitor_errors
    from utils.sanitizer import sanitize_text
except ImportError:
    def wait_for_arxiv():
        time.sleep(3)
    def retry(*a, **k):
        def d(f): return f
        return d
    def monitor_errors(*a, **k):
        def d(f): return f
        return d

load_dotenv('.env.local')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# arXiv dimension mapping
ARXIV_DIMENSION_MAP = {
    'cs.AI': 'cognitive',
    'cs.LG': 'cognitive',
    'cs.CL': 'cognitive',
    'q-bio': 'physical',
    'physics.med-ph': 'physical',
    'q-fin': 'financial',
    'econ': 'financial',
    'stat.ML': 'cognitive',
    'cs.CY': 'mental_health',
}

# Research topics by dimension
RESEARCH_TOPICS = {
    'cognitive': ['education technology', 'learning analytics', 'cognitive development'],
    'self_management': ['time management', 'productivity', 'goal setting'],
    'financial': ['financial literacy', 'personal finance', 'investment'],
    'physical': ['health education', 'exercise science', 'nutrition'],
    'mental_health': ['mental health', 'psychology', 'well-being'],
    'character': ['character education', 'ethics', 'moral development'],
}


class AcademicHarvester:
    """Academic paper harvester from arXiv."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.base_url = "http://export.arxiv.org/api/query"
        self.stats = {'searched': 0, 'found': 0, 'saved': 0, 'errors': 0, 'duplicates': 0}
    
    def _is_duplicate(self, external_id: str) -> bool:
        try:
            result = self.supabase.table('raw_materials').select('id').eq(
                'external_id', external_id
            ).execute()
            return len(result.data) > 0
        except:
            return False
    
    @retry(config=RetryConfig(max_retries=3, initial_delay=3.0))
    @monitor_errors('arxiv_harvester')
    def search_arxiv(self, query: str, max_results: int = 10) -> List[Dict]:
        """Search arXiv for papers."""
        wait_for_arxiv()
        self.stats['searched'] += 1
        
        params = {
            'search_query': f'all:{query}',
            'start': 0,
            'max_results': max_results,
            'sortBy': 'submittedDate',
            'sortOrder': 'descending'
        }
        
        url = f"{self.base_url}?{urllib.parse.urlencode(params)}"
        
        try:
            with urllib.request.urlopen(url, timeout=30) as response:
                xml_data = response.read().decode('utf-8')
            
            root = ET.fromstring(xml_data)
            ns = {'atom': 'http://www.w3.org/2005/Atom', 'arxiv': 'http://arxiv.org/schemas/atom'}
            
            papers = []
            for entry in root.findall('atom:entry', ns):
                arxiv_id = entry.find('atom:id', ns).text.split('/')[-1]
                
                if self._is_duplicate(f"arxiv_{arxiv_id}"):
                    self.stats['duplicates'] += 1
                    continue
                
                title = entry.find('atom:title', ns).text.strip().replace('\n', ' ')
                abstract = entry.find('atom:summary', ns).text.strip()
                published = entry.find('atom:published', ns).text
                
                # Get categories
                categories = []
                for cat in entry.findall('atom:category', ns):
                    categories.append(cat.get('term'))
                
                # Detect dimension
                dimension = 'cognitive'
                for cat in categories:
                    for prefix, dim in ARXIV_DIMENSION_MAP.items():
                        if cat.startswith(prefix):
                            dimension = dim
                            break
                
                # Get authors
                authors = [
                    a.find('atom:name', ns).text 
                    for a in entry.findall('atom:author', ns)[:5]
                ]
                
                papers.append({
                    'external_id': f"arxiv_{arxiv_id}",
                    'title': title[:500],
                    'content': f"ABSTRACT:\n{abstract}",
                    'url': f"https://arxiv.org/abs/{arxiv_id}",
                    'published_at': published,
                    'language': 'en',
                    'detected_dimension': dimension,
                    'content_hash': hashlib.md5(abstract.encode()).hexdigest(),
                    'metadata': {
                        'source': 'arxiv',
                        'arxiv_id': arxiv_id,
                        'categories': categories,
                        'authors': authors,
                        'query': query
                    }
                })
                self.stats['found'] += 1
            
            return papers
            
        except Exception as e:
            logger.error(f"arXiv search failed: {e}")
            self.stats['errors'] += 1
            return []
    
    def _get_source_id(self) -> str:
        try:
            result = self.supabase.table('content_sources').select('id').eq(
                'source_type', 'academic'
            ).execute()
            if result.data:
                return result.data[0]['id']
            
            new_source = {
                'name': 'arXiv Academic Papers',
                'source_type': 'academic',
                'url': 'https://arxiv.org',
                'primary_dimension': 'cognitive',
                'is_active': True,
            }
            result = self.supabase.table('content_sources').insert(new_source).execute()
            return result.data[0]['id']
        except:
            return None
    
    def save_papers(self, papers: List[Dict]) -> int:
        source_id = self._get_source_id()
        saved = 0
        
        for paper in papers:
            try:
                paper['source_id'] = source_id
                self.supabase.table('raw_materials').insert(paper).execute()
                saved += 1
                self.stats['saved'] += 1
            except Exception as e:
                logger.debug(f"Save failed: {e}")
        
        return saved
    
    def run(self, topics: Optional[Dict] = None) -> Dict:
        logger.info("=" * 60)
        logger.info("📚 ACADEMIC HARVESTER v2.0")
        logger.info("=" * 60)
        
        search_topics = topics or RESEARCH_TOPICS
        
        for dimension, queries in search_topics.items():
            for query in queries:
                logger.info(f"🔍 Searching: {query}")
                papers = self.search_arxiv(query, max_results=5)
                if papers:
                    saved = self.save_papers(papers)
                    logger.info(f"  ✓ Saved {saved} papers")
        
        logger.info("=" * 60)
        logger.info(f"📊 SUMMARY: {self.stats}")
        return self.stats


def main():
    harvester = AcademicHarvester()
    harvester.run()


if __name__ == "__main__":
    main()
