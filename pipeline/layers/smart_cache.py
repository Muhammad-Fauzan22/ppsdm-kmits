"""
Smart Caching Module
Cache embeddings and API responses to reduce costs and improve speed
"""

import json
import hashlib
import os
import time
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime, timedelta


class SmartCache:
    """
    Intelligent caching system for:
    - API responses
    - Embeddings
    - Generated content
    - Intermediate processing results
    """
    
    def __init__(self, cache_dir: str = ".cache/pipeline", ttl_hours: int = 24):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.ttl_hours = ttl_hours
        
        # Subdirectories for different cache types
        self.api_cache_dir = self.cache_dir / "api_responses"
        self.embedding_cache_dir = self.cache_dir / "embeddings"
        self.content_cache_dir = self.cache_dir / "generated_content"
        self.processing_cache_dir = self.cache_dir / "processing"
        
        for d in [self.api_cache_dir, self.embedding_cache_dir, 
                  self.content_cache_dir, self.processing_cache_dir]:
            d.mkdir(exist_ok=True)
        
        self.stats = {
            "hits": 0,
            "misses": 0,
            "saved_tokens": 0,
            "saved_requests": 0
        }
    
    def _generate_key(self, data: Any) -> str:
        """Generate cache key from data"""
        if isinstance(data, str):
            key_data = data.encode('utf-8')
        else:
            key_data = json.dumps(data, sort_keys=True).encode('utf-8')
        
        return hashlib.sha256(key_data).hexdigest()[:16]
    
    def _is_cache_valid(self, cache_file: Path) -> bool:
        """Check if cache file is still valid (not expired)"""
        if not cache_file.exists():
            return False
        
        # Check TTL
        file_time = datetime.fromtimestamp(cache_file.stat().st_mtime)
        expiry_time = file_time + timedelta(hours=self.ttl_hours)
        
        return datetime.now() < expiry_time
    
    def get(self, key_data: Any, cache_type: str = "api") -> Optional[Any]:
        """
        Get item from cache
        
        Args:
            key_data: Data to generate cache key from
            cache_type: Type of cache ('api', 'embedding', 'content', 'processing')
            
        Returns:
            Cached data or None if not found/expired
        """
        key = self._generate_key(key_data)
        
        # Select cache directory
        cache_dirs = {
            "api": self.api_cache_dir,
            "embedding": self.embedding_cache_dir,
            "content": self.content_cache_dir,
            "processing": self.processing_cache_dir
        }
        
        cache_dir = cache_dirs.get(cache_type, self.api_cache_dir)
        cache_file = cache_dir / f"{key}.json"
        
        if self._is_cache_valid(cache_file):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cached = json.load(f)
                    self.stats["hits"] += 1
                    return cached["data"]
            except Exception as e:
                print(f"   [Cache] Error reading cache: {e}")
        
        self.stats["misses"] += 1
        return None
    
    def set(self, key_data: Any, data: Any, cache_type: str = "api") -> bool:
        """
        Store item in cache
        
        Args:
            key_data: Data to generate cache key from
            data: Data to cache
            cache_type: Type of cache
            
        Returns:
            True if cached successfully
        """
        key = self._generate_key(key_data)
        
        # Select cache directory
        cache_dirs = {
            "api": self.api_cache_dir,
            "embedding": self.embedding_cache_dir,
            "content": self.content_cache_dir,
            "processing": self.processing_cache_dir
        }
        
        cache_dir = cache_dirs.get(cache_type, self.api_cache_dir)
        cache_file = cache_dir / f"{key}.json"
        
        try:
            cache_entry = {
                "key": key,
                "timestamp": datetime.now().isoformat(),
                "ttl_hours": self.ttl_hours,
                "data": data
            }
            
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(cache_entry, f, ensure_ascii=False, indent=2)
            
            return True
        except Exception as e:
            print(f"   [Cache] Error writing cache: {e}")
            return False
    
    def get_or_compute(self, key_data: Any, compute_func, cache_type: str = "api") -> Any:
        """
        Get from cache or compute and cache
        
        Args:
            key_data: Data to generate cache key
            compute_func: Function to compute value if not cached
            cache_type: Type of cache
            
        Returns:
            Cached or computed value
        """
        # Try cache first
        cached = self.get(key_data, cache_type)
        if cached is not None:
            return cached
        
        # Compute and cache
        result = compute_func()
        self.set(key_data, result, cache_type)
        
        # Track savings
        if cache_type == "api":
            self.stats["saved_requests"] += 1
        elif cache_type == "embedding":
            self.stats["saved_tokens"] += len(str(key_data).split())
        
        return result
    
    def cache_embedding(self, text: str, embedding: List[float], model: str = "default"):
        """Cache an embedding vector"""
        key_data = f"{model}:{text}"
        self.set(key_data, embedding, "embedding")
    
    def get_embedding(self, text: str, model: str = "default") -> Optional[List[float]]:
        """Get cached embedding"""
        key_data = f"{model}:{text}"
        return self.get(key_data, "embedding")
    
    def cache_api_response(self, prompt: str, response: Any, provider: str = "default"):
        """Cache an API response"""
        key_data = f"{provider}:{prompt}"
        self.set(key_data, response, "api")
        self.stats["saved_requests"] += 1
    
    def get_api_response(self, prompt: str, provider: str = "default") -> Optional[Any]:
        """Get cached API response"""
        key_data = f"{provider}:{prompt}"
        return self.get(key_data, "api")
    
    def cache_content(self, content_id: str, content: Any, metadata: Dict = None):
        """Cache generated content"""
        cache_data = {
            "content": content,
            "metadata": metadata or {},
            "cached_at": datetime.now().isoformat()
        }
        self.set(content_id, cache_data, "content")
    
    def get_content(self, content_id: str) -> Optional[Dict]:
        """Get cached content"""
        return self.get(content_id, "content")
    
    def invalidate(self, key_data: Any, cache_type: str = "api") -> bool:
        """Invalidate a cache entry"""
        key = self._generate_key(key_data)
        
        cache_dirs = {
            "api": self.api_cache_dir,
            "embedding": self.embedding_cache_dir,
            "content": self.content_cache_dir,
            "processing": self.processing_cache_dir
        }
        
        cache_dir = cache_dirs.get(cache_type, self.api_cache_dir)
        cache_file = cache_dir / f"{key}.json"
        
        if cache_file.exists():
            cache_file.unlink()
            return True
        return False
    
    def clear_all(self, cache_type: Optional[str] = None):
        """Clear all cache or specific type"""
        if cache_type:
            cache_dirs = {
                "api": self.api_cache_dir,
                "embedding": self.embedding_cache_dir,
                "content": self.content_cache_dir,
                "processing": self.processing_cache_dir
            }
            dirs_to_clear = [cache_dirs.get(cache_type, self.cache_dir)]
        else:
            dirs_to_clear = [self.api_cache_dir, self.embedding_cache_dir,
                           self.content_cache_dir, self.processing_cache_dir]
        
        cleared = 0
        for cache_dir in dirs_to_clear:
            if cache_dir.exists():
                for cache_file in cache_dir.glob("*.json"):
                    cache_file.unlink()
                    cleared += 1
        
        print(f"   [Cache] Cleared {cleared} cache entries")
        return cleared
    
    def cleanup_expired(self) -> int:
        """Remove expired cache entries"""
        cleared = 0
        for cache_dir in [self.api_cache_dir, self.embedding_cache_dir,
                         self.content_cache_dir, self.processing_cache_dir]:
            for cache_file in cache_dir.glob("*.json"):
                if not self._is_cache_valid(cache_file):
                    cache_file.unlink()
                    cleared += 1
        
        return cleared
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_files = sum(
            len(list(d.glob("*.json"))) 
            for d in [self.api_cache_dir, self.embedding_cache_dir,
                     self.content_cache_dir, self.processing_cache_dir]
        )
        
        hit_rate = 0
        total_requests = self.stats["hits"] + self.stats["misses"]
        if total_requests > 0:
            hit_rate = (self.stats["hits"] / total_requests) * 100
        
        # Estimate cost savings
        avg_request_cost = 0.002  # $0.002 per API call
        estimated_savings = self.stats["saved_requests"] * avg_request_cost
        
        return {
            "hits": self.stats["hits"],
            "misses": self.stats["misses"],
            "hit_rate_percent": round(hit_rate, 2),
            "saved_requests": self.stats["saved_requests"],
            "saved_tokens": self.stats["saved_tokens"],
            "estimated_cost_savings_usd": round(estimated_savings, 4),
            "total_cached_items": total_files,
            "cache_size_mb": self._get_cache_size(),
            "ttl_hours": self.ttl_hours
        }
    
    def _get_cache_size(self) -> float:
        """Get total cache size in MB"""
        total_size = 0
        for cache_dir in [self.api_cache_dir, self.embedding_cache_dir,
                         self.content_cache_dir, self.processing_cache_dir]:
            for cache_file in cache_dir.glob("*.json"):
                total_size += cache_file.stat().st_size
        
        return round(total_size / (1024 * 1024), 2)
    
    def get_cache_summary(self) -> Dict[str, Any]:
        """Get summary of all cached content"""
        summary = {
            "api_responses": self._summarize_directory(self.api_cache_dir),
            "embeddings": self._summarize_directory(self.embedding_cache_dir),
            "generated_content": self._summarize_directory(self.content_cache_dir),
            "processing_results": self._summarize_directory(self.processing_cache_dir)
        }
        return summary
    
    def _summarize_directory(self, directory: Path) -> Dict:
        """Summarize a cache directory"""
        files = list(directory.glob("*.json"))
        total_size = sum(f.stat().st_size for f in files)
        
        return {
            "count": len(files),
            "size_mb": round(total_size / (1024 * 1024), 2),
            "directory": str(directory)
        }


# Singleton instance
cache_instance: Optional[SmartCache] = None


def get_cache(cache_dir: str = ".cache/pipeline", ttl_hours: int = 24) -> SmartCache:
    """Get or create cache instance"""
    global cache_instance
    if cache_instance is None:
        cache_instance = SmartCache(cache_dir, ttl_hours)
    return cache_instance


def cached(cache_type: str = "api", ttl_hours: Optional[int] = None):
    """
    Decorator to cache function results
    
    Usage:
        @cached(cache_type="api")
        def expensive_api_call(prompt):
            return api.generate(prompt)
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            cache = get_cache()
            
            # Create key from function name and arguments
            key_data = {
                "function": func.__name__,
                "args": args,
                "kwargs": kwargs
            }
            
            # Try cache
            cached_result = cache.get(key_data, cache_type)
            if cached_result is not None:
                return cached_result
            
            # Compute and cache
            result = func(*args, **kwargs)
            cache.set(key_data, result, cache_type)
            return result
        
        return wrapper
    return decorator


if __name__ == "__main__":
    # Test
    cache = get_cache()
    
    # Test caching
    test_data = {"prompt": "Generate course on Python", "provider": "openai"}
    test_response = {"course": "Python 101", "modules": []}
    
    # Store
    cache.set(test_data, test_response, "api")
    
    # Retrieve
    cached = cache.get(test_data, "api")
    print(f"Cached data: {cached}")
    
    # Stats
    print(f"Cache stats: {cache.get_stats()}")