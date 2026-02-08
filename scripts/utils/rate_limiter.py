"""
Rate Limiter - Infinite Learning Factory
=========================================
Token bucket algorithm for API rate limiting.
Prevents IP blocking from external services.

Limits:
- arXiv: 1 request/3 seconds
- YouTube: 1 request/2 seconds
- Semantic Scholar: 10 requests/minute
- Gemini: 15 requests/minute (1500/day free tier)
- RSS: Random 1-5 second delay
"""

import time
import random
import threading
from datetime import datetime
from typing import Dict, Optional
from dataclasses import dataclass
from functools import wraps
import logging

logger = logging.getLogger(__name__)


@dataclass
class RateLimitConfig:
    """Configuration for a rate limiter."""
    requests_per_period: int
    period_seconds: float
    burst_limit: Optional[int] = None
    jitter_seconds: float = 0.0
    
    def __post_init__(self):
        if self.burst_limit is None:
            self.burst_limit = self.requests_per_period


# Pre-configured rate limits for different providers
RATE_LIMITS: Dict[str, RateLimitConfig] = {
    # Academic APIs
    'arxiv': RateLimitConfig(
        requests_per_period=1,
        period_seconds=3.0,
        burst_limit=1,
        jitter_seconds=0.5
    ),
    'semantic_scholar': RateLimitConfig(
        requests_per_period=10,
        period_seconds=60.0,
        burst_limit=5,
        jitter_seconds=1.0
    ),
    
    # Video/Content APIs
    'youtube': RateLimitConfig(
        requests_per_period=1,
        period_seconds=2.0,
        burst_limit=1,
        jitter_seconds=0.5
    ),
    
    # AI APIs
    'gemini': RateLimitConfig(
        requests_per_period=15,
        period_seconds=60.0,
        burst_limit=5,
        jitter_seconds=0.2
    ),
    'huggingface': RateLimitConfig(
        requests_per_period=30,
        period_seconds=60.0,
        burst_limit=10,
        jitter_seconds=0.1
    ),
    'groq': RateLimitConfig(
        requests_per_period=30,
        period_seconds=60.0,
        burst_limit=10,
        jitter_seconds=0.1
    ),
    
    # RSS Feeds
    'rss': RateLimitConfig(
        requests_per_period=1,
        period_seconds=2.0,
        burst_limit=1,
        jitter_seconds=2.0  # Random 1-5 seconds
    ),
    
    # General/Default
    'default': RateLimitConfig(
        requests_per_period=10,
        period_seconds=60.0,
        burst_limit=5,
        jitter_seconds=0.5
    ),
}


class TokenBucket:
    """
    Token bucket rate limiter implementation.
    
    Tokens are added at a constant rate (requests_per_period / period_seconds).
    Requests consume tokens. If no tokens available, caller must wait.
    """
    
    def __init__(self, config: RateLimitConfig):
        self.config = config
        self.tokens = float(config.burst_limit)
        self.max_tokens = float(config.burst_limit)
        self.refill_rate = config.requests_per_period / config.period_seconds
        self.last_refill = time.monotonic()
        self._lock = threading.Lock()
        
        # Statistics
        self.total_requests = 0
        self.total_waits = 0
        self.total_wait_time = 0.0
    
    def _refill(self) -> None:
        """Refill tokens based on elapsed time."""
        now = time.monotonic()
        elapsed = now - self.last_refill
        tokens_to_add = elapsed * self.refill_rate
        self.tokens = min(self.max_tokens, self.tokens + tokens_to_add)
        self.last_refill = now
    
    def _get_jitter(self) -> float:
        """Get random jitter to prevent thundering herd."""
        if self.config.jitter_seconds <= 0:
            return 0.0
        return random.uniform(0, self.config.jitter_seconds)
    
    def acquire(self, blocking: bool = True, timeout: Optional[float] = None) -> bool:
        """
        Acquire a token from the bucket.
        
        Args:
            blocking: If True, wait for token. If False, return immediately.
            timeout: Maximum time to wait for token (None = no limit).
        
        Returns:
            True if token acquired, False otherwise.
        """
        start_time = time.monotonic()
        
        with self._lock:
            self._refill()
            self.total_requests += 1
            
            if self.tokens >= 1.0:
                self.tokens -= 1.0
                # Add jitter after successful acquire
                jitter = self._get_jitter()
                if jitter > 0:
                    time.sleep(jitter)
                return True
            
            if not blocking:
                return False
            
            # Calculate wait time
            tokens_needed = 1.0 - self.tokens
            wait_time = tokens_needed / self.refill_rate
            
            # Check timeout
            if timeout is not None and wait_time > timeout:
                return False
            
            # Log the wait
            logger.debug(f"Rate limited. Waiting {wait_time:.2f}s for token...")
            self.total_waits += 1
            self.total_wait_time += wait_time
        
        # Wait outside lock
        time.sleep(wait_time)
        
        # Try again after waiting
        with self._lock:
            self._refill()
            if self.tokens >= 1.0:
                self.tokens -= 1.0
                jitter = self._get_jitter()
                if jitter > 0:
                    time.sleep(jitter)
                return True
        
        return False
    
    def get_stats(self) -> Dict:
        """Get rate limiter statistics."""
        with self._lock:
            return {
                'total_requests': self.total_requests,
                'total_waits': self.total_waits,
                'total_wait_time': self.total_wait_time,
                'current_tokens': self.tokens,
                'wait_rate': self.total_waits / max(1, self.total_requests)
            }


class RateLimiterManager:
    """
    Manages rate limiters for multiple providers.
    Singleton pattern for global access.
    """
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self._buckets: Dict[str, TokenBucket] = {}
        self._bucket_lock = threading.Lock()
        self._initialized = True
        logger.info("RateLimiterManager initialized")
    
    def get_limiter(self, provider: str) -> TokenBucket:
        """Get or create a rate limiter for a provider."""
        with self._bucket_lock:
            if provider not in self._buckets:
                config = RATE_LIMITS.get(provider, RATE_LIMITS['default'])
                self._buckets[provider] = TokenBucket(config)
                logger.debug(f"Created rate limiter for '{provider}': {config}")
            return self._buckets[provider]
    
    def acquire(self, provider: str, blocking: bool = True, timeout: Optional[float] = None) -> bool:
        """Acquire a token for the specified provider."""
        limiter = self.get_limiter(provider)
        return limiter.acquire(blocking=blocking, timeout=timeout)
    
    def wait(self, provider: str, timeout: Optional[float] = None) -> bool:
        """Wait for rate limit (alias for acquire with blocking=True)."""
        return self.acquire(provider, blocking=True, timeout=timeout)
    
    def get_all_stats(self) -> Dict[str, Dict]:
        """Get statistics for all rate limiters."""
        with self._bucket_lock:
            return {
                provider: bucket.get_stats()
                for provider, bucket in self._buckets.items()
            }
    
    def reset(self, provider: Optional[str] = None) -> None:
        """Reset rate limiter(s)."""
        with self._bucket_lock:
            if provider:
                if provider in self._buckets:
                    del self._buckets[provider]
            else:
                self._buckets.clear()


# Global instance
rate_limiter = RateLimiterManager()


def rate_limited(provider: str, timeout: Optional[float] = None):
    """
    Decorator to rate limit a function.
    
    Usage:
        @rate_limited('gemini')
        def call_gemini_api():
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not rate_limiter.acquire(provider, timeout=timeout):
                raise RateLimitExceeded(f"Rate limit exceeded for {provider}")
            return func(*args, **kwargs)
        return wrapper
    return decorator


class RateLimitExceeded(Exception):
    """Exception raised when rate limit is exceeded and timeout reached."""
    pass


# Convenience functions
def wait_for_arxiv() -> None:
    """Wait for arXiv rate limit."""
    rate_limiter.wait('arxiv')


def wait_for_youtube() -> None:
    """Wait for YouTube rate limit."""
    rate_limiter.wait('youtube')


def wait_for_gemini() -> None:
    """Wait for Gemini rate limit."""
    rate_limiter.wait('gemini')


def wait_for_rss() -> None:
    """Wait for RSS rate limit."""
    rate_limiter.wait('rss')


def wait_for_semantic_scholar() -> None:
    """Wait for Semantic Scholar rate limit."""
    rate_limiter.wait('semantic_scholar')


def random_delay(min_seconds: float = 1.0, max_seconds: float = 5.0) -> None:
    """Add random delay between min and max seconds."""
    delay = random.uniform(min_seconds, max_seconds)
    time.sleep(delay)


if __name__ == "__main__":
    # Test rate limiter
    logging.basicConfig(level=logging.DEBUG)
    
    print("Testing rate limiter...")
    
    # Test Gemini rate limiter (15/min)
    for i in range(5):
        start = time.time()
        rate_limiter.wait('gemini')
        elapsed = time.time() - start
        print(f"Request {i+1}: waited {elapsed:.3f}s")
    
    print("\nStats:", rate_limiter.get_all_stats())
