"""
Redis Cache Layer - Infinite Learning Factory
==============================================
Caching layer using Upstash Redis (FREE tier).
Reduces API calls and improves performance.
"""

import os
import json
import hashlib
import logging
from typing import Optional, Any, Dict
from datetime import timedelta
from functools import wraps

# Try Redis client
try:
    from redis import Redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CacheConfig:
    """Cache TTL configurations."""
    SHORT = 300      # 5 minutes
    MEDIUM = 3600    # 1 hour
    LONG = 86400     # 24 hours
    STATS = 300      # 5 min for stats
    MODULES = 3600   # 1 hour for modules
    DIMENSIONS = 86400  # 24h for classifications


class RedisCache:
    """Redis cache wrapper with fallback to in-memory."""
    
    def __init__(self):
        self.redis: Optional[Redis] = None
        self.memory_cache: Dict[str, Any] = {}
        self.memory_ttl: Dict[str, float] = {}
        self.stats = {'hits': 0, 'misses': 0, 'sets': 0}
        
        self._init_redis()
    
    def _init_redis(self) -> None:
        """Initialize Redis connection."""
        redis_url = os.environ.get('UPSTASH_REDIS_URL') or os.environ.get('REDIS_URL')
        
        if not redis_url or not REDIS_AVAILABLE:
            logger.info("Redis not configured, using memory cache")
            return
        
        try:
            self.redis = Redis.from_url(
                redis_url,
                decode_responses=True,
                socket_timeout=5,
                socket_connect_timeout=5
            )
            self.redis.ping()
            logger.info("✅ Redis connected")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}")
            self.redis = None
    
    def _make_key(self, prefix: str, key: str) -> str:
        """Create cache key with prefix."""
        return f"lf:{prefix}:{hashlib.md5(key.encode()).hexdigest()[:16]}"
    
    def get(self, prefix: str, key: str) -> Optional[Any]:
        """Get value from cache."""
        cache_key = self._make_key(prefix, key)
        
        if self.redis:
            try:
                value = self.redis.get(cache_key)
                if value:
                    self.stats['hits'] += 1
                    return json.loads(value)
            except:
                pass
        
        # Fallback to memory
        if cache_key in self.memory_cache:
            import time
            if self.memory_ttl.get(cache_key, 0) > time.time():
                self.stats['hits'] += 1
                return self.memory_cache[cache_key]
            else:
                del self.memory_cache[cache_key]
        
        self.stats['misses'] += 1
        return None
    
    def set(self, prefix: str, key: str, value: Any, ttl: int = CacheConfig.MEDIUM) -> bool:
        """Set value in cache."""
        cache_key = self._make_key(prefix, key)
        self.stats['sets'] += 1
        
        try:
            serialized = json.dumps(value, default=str)
        except:
            return False
        
        if self.redis:
            try:
                self.redis.setex(cache_key, ttl, serialized)
                return True
            except:
                pass
        
        # Fallback to memory
        import time
        self.memory_cache[cache_key] = value
        self.memory_ttl[cache_key] = time.time() + ttl
        
        # Limit memory cache size
        if len(self.memory_cache) > 1000:
            oldest = min(self.memory_ttl, key=self.memory_ttl.get)
            del self.memory_cache[oldest]
            del self.memory_ttl[oldest]
        
        return True
    
    def delete(self, prefix: str, key: str) -> bool:
        """Delete key from cache."""
        cache_key = self._make_key(prefix, key)
        
        if self.redis:
            try:
                self.redis.delete(cache_key)
            except:
                pass
        
        self.memory_cache.pop(cache_key, None)
        self.memory_ttl.pop(cache_key, None)
        return True
    
    def clear_prefix(self, prefix: str) -> int:
        """Clear all keys with prefix."""
        pattern = f"lf:{prefix}:*"
        count = 0
        
        if self.redis:
            try:
                for key in self.redis.scan_iter(pattern):
                    self.redis.delete(key)
                    count += 1
            except:
                pass
        
        # Clear memory
        to_delete = [k for k in self.memory_cache if k.startswith(f"lf:{prefix}:")]
        for k in to_delete:
            del self.memory_cache[k]
            self.memory_ttl.pop(k, None)
            count += 1
        
        return count
    
    def get_stats(self) -> Dict:
        """Get cache statistics."""
        total = self.stats['hits'] + self.stats['misses']
        hit_rate = self.stats['hits'] / max(1, total)
        
        return {
            **self.stats,
            'hit_rate': f"{hit_rate:.1%}",
            'redis_connected': self.redis is not None,
            'memory_size': len(self.memory_cache)
        }


# Global instance
cache = RedisCache()


def cached(prefix: str, ttl: int = CacheConfig.MEDIUM, key_func=None):
    """
    Decorator for caching function results.
    
    Usage:
        @cached('modules', ttl=3600)
        def get_module(slug):
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            if key_func:
                cache_key = key_func(*args, **kwargs)
            else:
                cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Try cache
            result = cache.get(prefix, cache_key)
            if result is not None:
                return result
            
            # Execute and cache
            result = func(*args, **kwargs)
            if result is not None:
                cache.set(prefix, cache_key, result, ttl)
            
            return result
        return wrapper
    return decorator


# Convenience functions
def get_cached_stats() -> Optional[Dict]:
    """Get cached stats."""
    return cache.get('stats', 'all')


def set_cached_stats(stats: Dict) -> None:
    """Cache stats."""
    cache.set('stats', 'all', stats, CacheConfig.STATS)


def get_cached_module(slug: str) -> Optional[Dict]:
    """Get cached module."""
    return cache.get('module', slug)


def set_cached_module(slug: str, module: Dict) -> None:
    """Cache module."""
    cache.set('module', slug, module, CacheConfig.MODULES)


def invalidate_module(slug: str) -> None:
    """Invalidate module cache."""
    cache.delete('module', slug)


if __name__ == "__main__":
    print("Testing Redis Cache...")
    
    # Test set/get
    cache.set('test', 'key1', {'data': 'value'}, ttl=60)
    result = cache.get('test', 'key1')
    print(f"Get: {result}")
    
    # Test decorator
    @cached('test', ttl=60)
    def slow_function(x):
        import time
        time.sleep(0.1)
        return x * 2
    
    print(f"First call: {slow_function(5)}")
    print(f"Cached call: {slow_function(5)}")
    
    print(f"\nStats: {cache.get_stats()}")
