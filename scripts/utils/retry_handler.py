"""
Retry Handler - Infinite Learning Factory
==========================================
Exponential backoff retry mechanism with jitter.
Prevents cascade failures with circuit breaker pattern.
"""

import time
import random
import logging
import functools
from enum import Enum
from typing import Callable, Optional, Type, Tuple, Any, List
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import threading

logger = logging.getLogger(__name__)


class RetryStrategy(Enum):
    """Retry strategies for different failure types."""
    EXPONENTIAL = "exponential"     # 1s, 2s, 4s, 8s...
    LINEAR = "linear"               # 1s, 2s, 3s, 4s...
    CONSTANT = "constant"           # 1s, 1s, 1s, 1s...
    FIBONACCI = "fibonacci"         # 1s, 1s, 2s, 3s, 5s...


@dataclass
class RetryConfig:
    """Configuration for retry behavior."""
    max_retries: int = 3
    initial_delay: float = 1.0
    max_delay: float = 60.0
    strategy: RetryStrategy = RetryStrategy.EXPONENTIAL
    exponential_base: float = 2.0
    jitter: bool = True
    jitter_range: Tuple[float, float] = (0.0, 1.0)
    retryable_exceptions: Tuple[Type[Exception], ...] = (Exception,)
    non_retryable_exceptions: Tuple[Type[Exception], ...] = ()


# Default configurations for different scenarios
RETRY_CONFIGS = {
    'api_call': RetryConfig(
        max_retries=3,
        initial_delay=1.0,
        max_delay=30.0,
        strategy=RetryStrategy.EXPONENTIAL,
        jitter=True
    ),
    'database': RetryConfig(
        max_retries=5,
        initial_delay=0.5,
        max_delay=10.0,
        strategy=RetryStrategy.EXPONENTIAL,
        jitter=True
    ),
    'network': RetryConfig(
        max_retries=3,
        initial_delay=2.0,
        max_delay=60.0,
        strategy=RetryStrategy.EXPONENTIAL,
        jitter=True
    ),
    'ai_generation': RetryConfig(
        max_retries=2,
        initial_delay=5.0,
        max_delay=30.0,
        strategy=RetryStrategy.EXPONENTIAL,
        jitter=True
    ),
}


def calculate_delay(
    attempt: int,
    config: RetryConfig
) -> float:
    """Calculate delay for the given attempt number."""
    if config.strategy == RetryStrategy.EXPONENTIAL:
        delay = config.initial_delay * (config.exponential_base ** attempt)
    elif config.strategy == RetryStrategy.LINEAR:
        delay = config.initial_delay * (attempt + 1)
    elif config.strategy == RetryStrategy.CONSTANT:
        delay = config.initial_delay
    elif config.strategy == RetryStrategy.FIBONACCI:
        fib = [1, 1]
        for _ in range(attempt):
            fib.append(fib[-1] + fib[-2])
        delay = config.initial_delay * fib[min(attempt, len(fib) - 1)]
    else:
        delay = config.initial_delay
    
    # Apply max delay cap
    delay = min(delay, config.max_delay)
    
    # Apply jitter
    if config.jitter:
        jitter = random.uniform(*config.jitter_range)
        delay += jitter
    
    return delay


def should_retry(exception: Exception, config: RetryConfig) -> bool:
    """Determine if an exception should be retried."""
    # Check non-retryable first
    if isinstance(exception, config.non_retryable_exceptions):
        return False
    
    # Check if it's retryable
    return isinstance(exception, config.retryable_exceptions)


def retry(
    config: Optional[RetryConfig] = None,
    config_name: Optional[str] = None,
    on_retry: Optional[Callable[[Exception, int], None]] = None,
    on_failure: Optional[Callable[[Exception, int], None]] = None,
):
    """
    Decorator for automatic retry with exponential backoff.
    
    Usage:
        @retry(config_name='api_call')
        def call_api():
            ...
        
        @retry(config=RetryConfig(max_retries=5))
        def custom_retry():
            ...
    """
    if config is None:
        if config_name and config_name in RETRY_CONFIGS:
            config = RETRY_CONFIGS[config_name]
        else:
            config = RETRY_CONFIGS['api_call']
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(config.max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    
                    # Check if we should retry
                    if not should_retry(e, config):
                        logger.warning(f"Non-retryable exception: {type(e).__name__}")
                        raise
                    
                    # Check if we have retries left
                    if attempt >= config.max_retries:
                        logger.error(
                            f"Max retries ({config.max_retries}) exceeded for {func.__name__}"
                        )
                        if on_failure:
                            on_failure(e, attempt)
                        raise
                    
                    # Calculate delay
                    delay = calculate_delay(attempt, config)
                    
                    logger.warning(
                        f"Retry {attempt + 1}/{config.max_retries} for {func.__name__} "
                        f"after {delay:.2f}s. Error: {type(e).__name__}: {str(e)[:100]}"
                    )
                    
                    if on_retry:
                        on_retry(e, attempt)
                    
                    time.sleep(delay)
            
            raise last_exception
        
        return wrapper
    return decorator


class CircuitState(Enum):
    """States for circuit breaker."""
    CLOSED = "closed"       # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open" # Testing if recovered


@dataclass
class CircuitBreakerConfig:
    """Configuration for circuit breaker."""
    failure_threshold: int = 5
    success_threshold: int = 2
    timeout_seconds: float = 60.0
    half_open_max_calls: int = 3


class CircuitBreaker:
    """
    Circuit breaker pattern implementation.
    
    Prevents cascade failures by stopping requests to failing services.
    """
    
    def __init__(self, name: str, config: Optional[CircuitBreakerConfig] = None):
        self.name = name
        self.config = config or CircuitBreakerConfig()
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time: Optional[datetime] = None
        self.half_open_calls = 0
        self._lock = threading.Lock()
        
        logger.info(f"CircuitBreaker '{name}' initialized in CLOSED state")
    
    def _check_timeout(self) -> bool:
        """Check if timeout has passed since last failure."""
        if self.last_failure_time is None:
            return True
        elapsed = (datetime.now() - self.last_failure_time).total_seconds()
        return elapsed >= self.config.timeout_seconds
    
    def _transition_to(self, new_state: CircuitState) -> None:
        """Transition to a new state."""
        old_state = self.state
        self.state = new_state
        
        if new_state == CircuitState.CLOSED:
            self.failure_count = 0
            self.success_count = 0
            self.half_open_calls = 0
        elif new_state == CircuitState.HALF_OPEN:
            self.half_open_calls = 0
            self.success_count = 0
        
        logger.info(f"CircuitBreaker '{self.name}': {old_state.value} -> {new_state.value}")
    
    def can_execute(self) -> bool:
        """Check if execution is allowed."""
        with self._lock:
            if self.state == CircuitState.CLOSED:
                return True
            
            if self.state == CircuitState.OPEN:
                # Check if we should try half-open
                if self._check_timeout():
                    self._transition_to(CircuitState.HALF_OPEN)
                    return True
                return False
            
            if self.state == CircuitState.HALF_OPEN:
                # Allow limited calls in half-open
                if self.half_open_calls < self.config.half_open_max_calls:
                    self.half_open_calls += 1
                    return True
                return False
            
            return False
    
    def record_success(self) -> None:
        """Record a successful execution."""
        with self._lock:
            if self.state == CircuitState.HALF_OPEN:
                self.success_count += 1
                if self.success_count >= self.config.success_threshold:
                    self._transition_to(CircuitState.CLOSED)
            elif self.state == CircuitState.CLOSED:
                # Reset failure count on success
                self.failure_count = 0
    
    def record_failure(self, exception: Exception) -> None:
        """Record a failed execution."""
        with self._lock:
            self.last_failure_time = datetime.now()
            
            if self.state == CircuitState.HALF_OPEN:
                # Immediately go back to open
                self._transition_to(CircuitState.OPEN)
            elif self.state == CircuitState.CLOSED:
                self.failure_count += 1
                if self.failure_count >= self.config.failure_threshold:
                    self._transition_to(CircuitState.OPEN)
                    logger.warning(
                        f"CircuitBreaker '{self.name}' opened after "
                        f"{self.failure_count} failures"
                    )
    
    def get_state(self) -> dict:
        """Get current state information."""
        with self._lock:
            return {
                'name': self.name,
                'state': self.state.value,
                'failure_count': self.failure_count,
                'success_count': self.success_count,
                'half_open_calls': self.half_open_calls,
                'last_failure': self.last_failure_time.isoformat() if self.last_failure_time else None
            }


class CircuitBreakerOpen(Exception):
    """Exception raised when circuit breaker is open."""
    pass


class CircuitBreakerManager:
    """Manages circuit breakers for multiple services."""
    
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
        self._breakers: dict[str, CircuitBreaker] = {}
        self._breaker_lock = threading.Lock()
        self._initialized = True
    
    def get_breaker(
        self,
        name: str,
        config: Optional[CircuitBreakerConfig] = None
    ) -> CircuitBreaker:
        """Get or create a circuit breaker for a service."""
        with self._breaker_lock:
            if name not in self._breakers:
                self._breakers[name] = CircuitBreaker(name, config)
            return self._breakers[name]
    
    def get_all_states(self) -> dict:
        """Get states of all circuit breakers."""
        with self._breaker_lock:
            return {
                name: breaker.get_state()
                for name, breaker in self._breakers.items()
            }


# Global instance
circuit_breaker_manager = CircuitBreakerManager()


def with_circuit_breaker(
    name: str,
    config: Optional[CircuitBreakerConfig] = None,
    fallback: Optional[Callable] = None
):
    """
    Decorator to add circuit breaker to a function.
    
    Usage:
        @with_circuit_breaker('external_api')
        def call_external_api():
            ...
        
        @with_circuit_breaker('ai_service', fallback=lambda: "default")
        def call_ai():
            ...
    """
    def decorator(func: Callable) -> Callable:
        breaker = circuit_breaker_manager.get_breaker(name, config)
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if not breaker.can_execute():
                logger.warning(f"Circuit breaker '{name}' is OPEN, rejecting request")
                if fallback:
                    return fallback()
                raise CircuitBreakerOpen(f"Circuit breaker '{name}' is open")
            
            try:
                result = func(*args, **kwargs)
                breaker.record_success()
                return result
            except Exception as e:
                breaker.record_failure(e)
                raise
        
        return wrapper
    return decorator


def retry_with_circuit_breaker(
    circuit_name: str,
    retry_config: Optional[RetryConfig] = None,
    circuit_config: Optional[CircuitBreakerConfig] = None,
    fallback: Optional[Callable] = None
):
    """
    Combined decorator for retry and circuit breaker.
    
    Retries happen inside the circuit breaker - failures during retry
    all count toward the circuit breaker threshold.
    """
    def decorator(func: Callable) -> Callable:
        # Apply circuit breaker first (outer), then retry (inner)
        retried_func = retry(config=retry_config)(func)
        circuit_func = with_circuit_breaker(circuit_name, circuit_config, fallback)(retried_func)
        return circuit_func
    return decorator


if __name__ == "__main__":
    # Test retry and circuit breaker
    logging.basicConfig(level=logging.DEBUG)
    
    fail_count = [0]
    
    @retry(config=RetryConfig(max_retries=3, initial_delay=0.5))
    def flaky_function():
        fail_count[0] += 1
        if fail_count[0] < 3:
            raise Exception(f"Failure {fail_count[0]}")
        return "Success!"
    
    print("Testing retry...")
    result = flaky_function()
    print(f"Result: {result}")
    
    print("\nTesting circuit breaker...")
    breaker = CircuitBreaker("test", CircuitBreakerConfig(failure_threshold=2, timeout_seconds=5))
    
    for i in range(5):
        if breaker.can_execute():
            print(f"Request {i+1}: Executing...")
            breaker.record_failure(Exception("Test failure"))
        else:
            print(f"Request {i+1}: Circuit OPEN, rejected")
    
    print("\nCircuit state:", breaker.get_state())
