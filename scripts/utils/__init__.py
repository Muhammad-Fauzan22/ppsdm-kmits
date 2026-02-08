"""
Infinite Learning Factory - Utilities Package
==============================================
Export all utility modules for easy importing.

Usage:
    from utils import rate_limiter, retry, ai_provider, cache
"""

from .rate_limiter import (
    rate_limiter,
    rate_limited,
    wait_for_arxiv,
    wait_for_youtube,
    wait_for_gemini,
    wait_for_rss,
    random_delay,
    RateLimitExceeded,
)

from .retry_handler import (
    retry,
    RetryConfig,
    RetryStrategy,
    with_circuit_breaker,
    CircuitBreaker,
    CircuitBreakerOpen,
    circuit_breaker_manager,
)

from .monitoring import (
    error_monitor,
    monitor_errors,
    StructuredLogger,
    AlertLevel,
    get_health_status,
)

from .sanitizer import (
    sanitize_text,
    strip_html_tags,
    sanitize_filename,
    sanitize_url,
    ContentSanitizer,
)

from .cache import (
    cache,
    cached,
    CacheConfig,
    get_cached_stats,
    set_cached_stats,
)

from .ai_provider import (
    ai_provider,
    generate,
    generate_json,
    AIProvider,
    AIResponse,
)

__all__ = [
    # Rate limiting
    'rate_limiter',
    'rate_limited',
    'wait_for_arxiv',
    'wait_for_youtube',
    'wait_for_gemini',
    'wait_for_rss',
    'random_delay',
    'RateLimitExceeded',
    
    # Retry & Circuit breaker
    'retry',
    'RetryConfig',
    'RetryStrategy',
    'with_circuit_breaker',
    'CircuitBreaker',
    'CircuitBreakerOpen',
    'circuit_breaker_manager',
    
    # Monitoring
    'error_monitor',
    'monitor_errors',
    'StructuredLogger',
    'AlertLevel',
    'get_health_status',
    
    # Sanitization
    'sanitize_text',
    'strip_html_tags',
    'sanitize_filename',
    'sanitize_url',
    'ContentSanitizer',
    
    # Caching
    'cache',
    'cached',
    'CacheConfig',
    'get_cached_stats',
    'set_cached_stats',
    
    # AI Provider
    'ai_provider',
    'generate',
    'generate_json',
    'AIProvider',
    'AIResponse',
]
