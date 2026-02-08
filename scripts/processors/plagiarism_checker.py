"""
Plagiarism Checker - Infinite Learning Factory
===============================================
Semantic similarity and near-duplicate detection.
"""

import os
import sys
import hashlib
import logging
from typing import List, Dict, Optional, Tuple, Set
from dataclasses import dataclass

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

try:
    from datasketch import MinHash, MinHashLSH
    MINHASH_AVAILABLE = True
except ImportError:
    MINHASH_AVAILABLE = False

load_dotenv('.env.local')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class SimilarityResult:
    is_duplicate: bool
    similarity_score: float
    similar_ids: List[str]
    check_method: str


class TextFingerprint:
    """Fast text fingerprinting using MinHash."""
    
    def __init__(self, num_perm: int = 128):
        self.num_perm = num_perm
        self.lsh = MinHashLSH(threshold=0.5, num_perm=num_perm) if MINHASH_AVAILABLE else None
        self.fingerprints: Dict[str, MinHash] = {}
    
    def _get_shingles(self, text: str) -> Set[str]:
        words = text.lower().split()
        return set(' '.join(words[i:i+3]) for i in range(len(words) - 2))
    
    def add_document(self, doc_id: str, text: str) -> None:
        if not MINHASH_AVAILABLE:
            return
        mh = MinHash(num_perm=self.num_perm)
        for shingle in self._get_shingles(text):
            mh.update(shingle.encode('utf-8'))
        self.fingerprints[doc_id] = mh
        try:
            self.lsh.insert(doc_id, mh)
        except:
            pass
    
    def find_similar(self, text: str, threshold: float = 0.5) -> List[Tuple[str, float]]:
        if not MINHASH_AVAILABLE:
            return []
        mh = MinHash(num_perm=self.num_perm)
        for shingle in self._get_shingles(text):
            mh.update(shingle.encode('utf-8'))
        candidates = self.lsh.query(mh)
        results = []
        for doc_id in candidates:
            if doc_id in self.fingerprints:
                sim = mh.jaccard(self.fingerprints[doc_id])
                if sim >= threshold:
                    results.append((doc_id, sim))
        return sorted(results, key=lambda x: x[1], reverse=True)


class SimpleSimilarity:
    """Simple similarity using word overlap."""
    
    @staticmethod
    def jaccard(text1: str, text2: str) -> float:
        w1, w2 = set(text1.lower().split()), set(text2.lower().split())
        if not w1 or not w2:
            return 0.0
        return len(w1 & w2) / len(w1 | w2)
    
    @staticmethod
    def ngram(text1: str, text2: str, n: int = 3) -> float:
        def get_ngrams(t, n):
            words = t.lower().split()
            return set(' '.join(words[i:i+n]) for i in range(len(words) - n + 1))
        ng1, ng2 = get_ngrams(text1, n), get_ngrams(text2, n)
        if not ng1 or not ng2:
            return 0.0
        return len(ng1 & ng2) / len(ng1 | ng2)


class PlagiarismChecker:
    """Main plagiarism checker."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.fingerprint = TextFingerprint() if MINHASH_AVAILABLE else None
        self.simple = SimpleSimilarity()
        self.duplicate_threshold = 0.8
        self.warning_threshold = 0.5
        self.stats = {'checked': 0, 'duplicates': 0, 'warnings': 0}
    
    def load_existing_content(self, limit: int = 500) -> None:
        try:
            result = self.supabase.table('raw_materials').select(
                'id, content'
            ).order('harvested_at', desc=True).limit(limit).execute()
            for row in result.data:
                content = row.get('content', '')
                if content and len(content) > 50 and self.fingerprint:
                    self.fingerprint.add_document(row['id'], content)
            logger.info(f"Loaded {len(result.data)} documents")
        except Exception as e:
            logger.error(f"Failed to load content: {e}")
    
    def check(self, text: str) -> SimilarityResult:
        self.stats['checked'] += 1
        similar_ids = []
        max_sim = 0.0
        method = "simple"
        
        if self.fingerprint:
            for doc_id, sim in self.fingerprint.find_similar(text, self.warning_threshold)[:5]:
                similar_ids.append(doc_id)
                max_sim = max(max_sim, sim)
                method = "minhash"
        
        is_dup = max_sim >= self.duplicate_threshold
        if is_dup:
            self.stats['duplicates'] += 1
        elif max_sim >= self.warning_threshold:
            self.stats['warnings'] += 1
        
        return SimilarityResult(is_dup, max_sim, similar_ids, method)
    
    def get_stats(self) -> Dict:
        return {**self.stats, 'minhash_available': MINHASH_AVAILABLE}


if __name__ == "__main__":
    print("Testing Plagiarism Checker...")
    checker = PlagiarismChecker()
    
    text1 = "Machine learning enables computers to learn from data automatically."
    text2 = "ML allows machines to learn from data without explicit programming."
    
    if checker.fingerprint:
        checker.fingerprint.add_document("doc1", text1)
    
    result = checker.check(text2)
    print(f"Duplicate: {result.is_duplicate}, Similarity: {result.similarity_score:.2%}")
