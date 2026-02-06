#!/usr/bin/env python3
"""
Cross-Source Validation Service
Validates facts against free academic APIs: Wikipedia, Crossref, Semantic Scholar, CORE, Open Library

Author: PPSDM KMM Content Factory
Version: 1.0.0
"""

import os
import re
import json
import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from urllib.parse import quote

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ValidationStatus(Enum):
    """Validation result status"""
    CONFIRMED = "confirmed"
    PARTIALLY_CONFIRMED = "partially_confirmed"
    UNVERIFIED = "unverified"
    CONFLICT = "conflict"
    ERROR = "error"

@dataclass
class ValidationSource:
    """A source used for validation"""
    name: str
    url: str
    confidence: float
    snippet: str = ""

@dataclass
class ValidationResult:
    """Result of validating a claim"""
    claim: str
    status: ValidationStatus
    confidence: float
    sources: List[ValidationSource] = field(default_factory=list)
    contradictions: List[str] = field(default_factory=list)
    validation_time: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'claim': self.claim,
            'status': self.status.value,
            'confidence': self.confidence,
            'sources': [
                {'name': s.name, 'url': s.url, 'confidence': s.confidence, 'snippet': s.snippet}
                for s in self.sources
            ],
            'contradictions': self.contradictions,
            'validation_time': self.validation_time.isoformat()
        }

class ValidationService:
    """
    Cross-Source Validation Service
    
    Validates claims against multiple free academic sources:
    - Wikipedia API
    - Crossref API
    - Semantic Scholar API
    - CORE API
    - Open Library API
    
    Features:
    - Caching to reduce API calls
    - Consensus scoring across sources
    - Rate limiting
    - Async batch processing
    """
    
    def __init__(self, 
                 cache_ttl_hours: int = 24,
                 min_confidence_threshold: float = 0.6,
                 enable_cache: bool = True):
        """
        Initialize Validation Service
        
        Args:
            cache_ttl_hours: Cache time-to-live in hours
            min_confidence_threshold: Minimum confidence for confirmed status
            enable_cache: Enable response caching
        """
        self.min_confidence = min_confidence_threshold
        self.enable_cache = enable_cache
        
        # Simple in-memory cache
        self.cache: Dict[str, Dict] = {}
        self.cache_ttl = timedelta(hours=cache_ttl_hours)
        
        # Rate limiting
        self.last_request_time: Dict[str, datetime] = {}
        self.min_request_interval = 1.0  # seconds between requests to same API
        
        # API endpoints
        self.endpoints = {
            'wikipedia': 'https://en.wikipedia.org/api/rest_v1/page/summary/',
            'wikipedia_search': 'https://en.wikipedia.org/w/api.php',
            'crossref': 'https://api.crossref.org/works',
            'semantic_scholar': 'https://api.semanticscholar.org/graph/v1/paper/search',
            'core': 'https://api.core.ac.uk/v3/search/works',
            'openlibrary': 'https://openlibrary.org/search.json'
        }
        
        # API keys (optional)
        self.api_keys = {
            'core': os.getenv('CORE_API_KEY'),
            'semantic_scholar': os.getenv('SEMANTIC_SCHOLAR_API_KEY')
        }
        
        logger.info("Validation Service initialized")
        logger.info(f"  Cache enabled: {enable_cache}")
        logger.info(f"  Min confidence: {min_confidence_threshold}")
    
    async def validate_claim(self, claim: str) -> ValidationResult:
        """
        Validate a single claim across multiple sources
        
        Args:
            claim: The claim to validate
            
        Returns:
            ValidationResult with status and sources
        """
        logger.debug(f"Validating claim: {claim[:100]}...")
        
        # Check cache
        if self.enable_cache:
            cached = self._get_cache(claim)
            if cached:
                logger.debug("  Cache hit")
                return ValidationResult(**cached)
        
        sources = []
        contradictions = []
        
        # Validate against each source
        # Wikipedia
        try:
            wiki_result = await self._check_wikipedia(claim)
            if wiki_result:
                sources.append(wiki_result)
        except Exception as e:
            logger.debug(f"Wikipedia check failed: {e}")
        
        # Crossref
        try:
            crossref_result = await self._check_crossref(claim)
            if crossref_result:
                sources.append(crossref_result)
        except Exception as e:
            logger.debug(f"Crossref check failed: {e}")
        
        # Semantic Scholar
        try:
            ss_result = await self._check_semantic_scholar(claim)
            if ss_result:
                sources.append(ss_result)
        except Exception as e:
            logger.debug(f"Semantic Scholar check failed: {e}")
        
        # CORE
        try:
            core_result = await self._check_core(claim)
            if core_result:
                sources.append(core_result)
        except Exception as e:
            logger.debug(f"CORE check failed: {e}")
        
        # Calculate overall status and confidence
        status, confidence = self._calculate_consensus(sources, contradictions)
        
        result = ValidationResult(
            claim=claim,
            status=status,
            confidence=confidence,
            sources=sources,
            contradictions=contradictions
        )
        
        # Cache result
        if self.enable_cache:
            self._set_cache(claim, result.to_dict())
        
        return result
    
    async def validate_batch(self, claims: List[str], 
                            max_concurrent: int = 5) -> List[ValidationResult]:
        """
        Validate multiple claims in parallel
        
        Args:
            claims: List of claims to validate
            max_concurrent: Maximum concurrent validations
            
        Returns:
            List of ValidationResult
        """
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def validate_with_limit(claim: str) -> ValidationResult:
            async with semaphore:
                return await self.validate_claim(claim)
        
        tasks = [validate_with_limit(claim) for claim in claims]
        return await asyncio.gather(*tasks)
    
    async def _check_wikipedia(self, claim: str) -> Optional[ValidationSource]:
        """Check claim against Wikipedia"""
        import aiohttp
        
        # Extract key terms from claim
        key_terms = self._extract_key_terms(claim)
        if not key_terms:
            return None
        
        # Try searching with key terms
        search_term = key_terms[0][:50]  # Use first key term, limit length
        
        await self._rate_limit('wikipedia')
        
        try:
            async with aiohttp.ClientSession() as session:
                # Search Wikipedia
                search_url = f"{self.endpoints['wikipedia_search']}"
                params = {
                    'action': 'query',
                    'list': 'search',
                    'srsearch': search_term,
                    'format': 'json',
                    'srlimit': 3
                }
                
                async with session.get(search_url, params=params, timeout=10) as response:
                    if response.status != 200:
                        return None
                    
                    data = await response.json()
                    search_results = data.get('query', {}).get('search', [])
                    
                    if not search_results:
                        return None
                    
                    # Get first result
                    result = search_results[0]
                    title = result.get('title', '')
                    snippet = re.sub(r'<.*?>', '', result.get('snippet', ''))
                    
                    # Check relevance
                    relevance = self._calculate_relevance(claim, title + ' ' + snippet)
                    
                    if relevance > 0.3:
                        return ValidationSource(
                            name="Wikipedia",
                            url=f"https://en.wikipedia.org/wiki/{quote(title.replace(' ', '_'))}",
                            confidence=relevance,
                            snippet=snippet[:200]
                        )
                    
        except Exception as e:
            logger.debug(f"Wikipedia API error: {e}")
        
        return None
    
    async def _check_crossref(self, claim: str) -> Optional[ValidationSource]:
        """Check claim against Crossref"""
        import aiohttp
        
        key_terms = self._extract_key_terms(claim)
        if not key_terms:
            return None
        
        query = ' '.join(key_terms[:3])
        
        await self._rate_limit('crossref')
        
        try:
            async with aiohttp.ClientSession() as session:
                params = {
                    'query': query,
                    'rows': 5,
                    'sort': 'relevance',
                    'order': 'desc'
                }
                
                async with session.get(
                    self.endpoints['crossref'],
                    params=params,
                    timeout=10
                ) as response:
                    if response.status != 200:
                        return None
                    
                    data = await response.json()
                    items = data.get('message', {}).get('items', [])
                    
                    if not items:
                        return None
                    
                    # Get best match
                    best_match = items[0]
                    title = best_match.get('title', [''])[0] if best_match.get('title') else ''
                    abstract = best_match.get('abstract', '')[:300]
                    
                    relevance = self._calculate_relevance(claim, title + ' ' + abstract)
                    
                    if relevance > 0.3:
                        doi = best_match.get('DOI', '')
                        return ValidationSource(
                            name="Crossref",
                            url=f"https://doi.org/{doi}" if doi else "",
                            confidence=relevance * 0.9,  # Slightly lower confidence for abstracts
                            snippet=title
                        )
                    
        except Exception as e:
            logger.debug(f"Crossref API error: {e}")
        
        return None
    
    async def _check_semantic_scholar(self, claim: str) -> Optional[ValidationSource]:
        """Check claim against Semantic Scholar"""
        import aiohttp
        
        key_terms = self._extract_key_terms(claim)
        if not key_terms:
            return None
        
        query = ' '.join(key_terms[:3])
        
        await self._rate_limit('semantic_scholar')
        
        try:
            async with aiohttp.ClientSession() as session:
                params = {
                    'query': query,
                    'limit': 5,
                    'fields': 'title,abstract,url'
                }
                
                headers = {}
                if self.api_keys['semantic_scholar']:
                    headers['x-api-key'] = self.api_keys['semantic_scholar']
                
                async with session.get(
                    self.endpoints['semantic_scholar'],
                    params=params,
                    headers=headers,
                    timeout=10
                ) as response:
                    if response.status != 200:
                        return None
                    
                    data = await response.json()
                    papers = data.get('data', [])
                    
                    if not papers:
                        return None
                    
                    best_match = papers[0]
                    title = best_match.get('title', '')
                    abstract = best_match.get('abstract', '') or ''
                    
                    relevance = self._calculate_relevance(claim, title + ' ' + abstract)
                    
                    if relevance > 0.3:
                        return ValidationSource(
                            name="Semantic Scholar",
                            url=best_match.get('url', ''),
                            confidence=relevance * 0.85,
                            snippet=title
                        )
                    
        except Exception as e:
            logger.debug(f"Semantic Scholar API error: {e}")
        
        return None
    
    async def _check_core(self, claim: str) -> Optional[ValidationSource]:
        """Check claim against CORE API"""
        import aiohttp
        
        key_terms = self._extract_key_terms(claim)
        if not key_terms:
            return None
        
        query = ' '.join(key_terms[:3])
        
        await self._rate_limit('core')
        
        try:
            async with aiohttp.ClientSession() as session:
                params = {
                    'query': query,
                    'limit': 5
                }
                
                headers = {}
                if self.api_keys['core']:
                    headers['Authorization'] = f"Bearer {self.api_keys['core']}"
                
                async with session.get(
                    self.endpoints['core'],
                    params=params,
                    headers=headers,
                    timeout=10
                ) as response:
                    if response.status != 200:
                        return None
                    
                    data = await response.json()
                    results = data.get('results', [])
                    
                    if not results:
                        return None
                    
                    best_match = results[0]
                    title = best_match.get('title', '')
                    abstract = best_match.get('abstract', '') or ''
                    
                    relevance = self._calculate_relevance(claim, title + ' ' + abstract)
                    
                    if relevance > 0.3:
                        return ValidationSource(
                            name="CORE",
                            url=best_match.get('downloadUrl', best_match.get('links', [{}])[0].get('url', '')),
                            confidence=relevance * 0.85,
                            snippet=title
                        )
                    
        except Exception as e:
            logger.debug(f"CORE API error: {e}")
        
        return None
    
    def _extract_key_terms(self, text: str, max_terms: int = 5) -> List[str]:
        """Extract key terms from text for searching"""
        # Remove punctuation and convert to lowercase
        cleaned = re.sub(r'[^\w\s]', ' ', text.lower())
        
        # Split into words
        words = cleaned.split()
        
        # Filter out common stop words
        stop_words = {
            'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
            'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
            'would', 'could', 'should', 'may', 'might', 'must', 'shall',
            'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in',
            'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into',
            'through', 'during', 'before', 'after', 'above', 'below',
            'between', 'under', 'and', 'but', 'or', 'yet', 'so',
            'if', 'because', 'although', 'though', 'while', 'where',
            'when', 'that', 'which', 'who', 'whom', 'whose', 'what',
            'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
            'we', 'they', 'me', 'him', 'her', 'us', 'them'
        }
        
        # Get significant words (length > 3 and not stop words)
        significant = [w for w in words if len(w) > 3 and w not in stop_words]
        
        # Count frequency and get top terms
        from collections import Counter
        freq = Counter(significant)
        
        return [term for term, _ in freq.most_common(max_terms)]
    
    def _calculate_relevance(self, claim: str, source_text: str) -> float:
        """Calculate relevance score between claim and source text"""
        claim_terms = set(self._extract_key_terms(claim, 10))
        source_terms = set(self._extract_key_terms(source_text, 20))
        
        if not claim_terms:
            return 0.0
        
        # Calculate Jaccard similarity
        intersection = claim_terms & source_terms
        union = claim_terms | source_terms
        
        if not union:
            return 0.0
        
        return len(intersection) / len(union)
    
    def _calculate_consensus(self, 
                            sources: List[ValidationSource],
                            contradictions: List[str]) -> Tuple[ValidationStatus, float]:
        """
        Calculate consensus status and confidence across sources
        
        Returns:
            Tuple of (status, confidence)
        """
        if not sources:
            return ValidationStatus.UNVERIFIED, 0.0
        
        # Calculate weighted confidence
        total_confidence = sum(s.confidence for s in sources)
        avg_confidence = total_confidence / len(sources)
        
        # Adjust for contradictions
        if contradictions:
            avg_confidence *= 0.7
        
        # Determine status
        if avg_confidence >= self.min_confidence and len(sources) >= 2:
            status = ValidationStatus.CONFIRMED
        elif avg_confidence >= self.min_confidence * 0.8:
            status = ValidationStatus.PARTIALLY_CONFIRMED
        elif contradictions:
            status = ValidationStatus.CONFLICT
        else:
            status = ValidationStatus.UNVERIFIED
        
        return status, round(avg_confidence, 2)
    
    async def _rate_limit(self, api_name: str):
        """Apply rate limiting for API calls"""
        now = datetime.now()
        
        if api_name in self.last_request_time:
            elapsed = (now - self.last_request_time[api_name]).total_seconds()
            if elapsed < self.min_request_interval:
                await asyncio.sleep(self.min_request_interval - elapsed)
        
        self.last_request_time[api_name] = datetime.now()
    
    def _get_cache(self, claim: str) -> Optional[Dict]:
        """Get cached validation result"""
        key = hash(claim) % 1000000
        
        if key in self.cache:
            entry = self.cache[key]
            if datetime.now() - entry['timestamp'] < self.cache_ttl:
                return entry['data']
            else:
                del self.cache[key]
        
        return None
    
    def _set_cache(self, claim: str, data: Dict):
        """Cache validation result"""
        key = hash(claim) % 1000000
        
        # Simple LRU: remove oldest if too many entries
        if len(self.cache) > 1000:
            oldest = min(self.cache.keys(), key=lambda k: self.cache[k]['timestamp'])
            del self.cache[oldest]
        
        self.cache[key] = {
            'data': data,
            'timestamp': datetime.now()
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get service statistics"""
        return {
            'cache_size': len(self.cache),
            'endpoints': list(self.endpoints.keys()),
            'min_confidence': self.min_confidence
        }


# ==================== CLI TESTING ====================

async def test_validation():
    """Test validation service"""
    print("Testing Validation Service")
    print("=" * 60)
    
    validator = ValidationService()
    
    # Test claims
    test_claims = [
        "The capital of France is Paris",
        "Albert Einstein developed the theory of relativity",
        "Water boils at 100 degrees Celsius at sea level",
        "The Earth is flat",
        "Python was created by Guido van Rossum"
    ]
    
    print(f"\nValidating {len(test_claims)} claims...\n")
    
    for claim in test_claims:
        print(f"Claim: {claim}")
        
        try:
            result = await validator.validate_claim(claim)
            
            print(f"  Status: {result.status.value}")
            print(f"  Confidence: {result.confidence:.2%}")
            
            if result.sources:
                print(f"  Sources:")
                for source in result.sources:
                    print(f"    - {source.name} ({source.confidence:.2%})")
            
            print()
            
        except Exception as e:
            print(f"  ✗ Validation failed: {e}\n")
    
    print("=" * 60)


if __name__ == '__main__':
    asyncio.run(test_validation())
