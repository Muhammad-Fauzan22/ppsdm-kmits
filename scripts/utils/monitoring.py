"""
Error Monitoring - Infinite Learning Factory
============================================
Centralized error tracking, logging, and alerting.
Integrates with Sentry (free tier) and Slack webhooks.
"""

import os
import sys
import json
import logging
import traceback
import functools
import requests
from datetime import datetime
from typing import Optional, Dict, Any, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import threading
from queue import Queue
import atexit

# Optional Sentry integration
try:
    import sentry_sdk
    from sentry_sdk.integrations.logging import LoggingIntegration
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False

logger = logging.getLogger(__name__)


class AlertLevel(Enum):
    """Alert severity levels."""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class ErrorEvent:
    """Structured error event for tracking."""
    timestamp: str
    level: str
    message: str
    error_type: str
    error_message: str
    stack_trace: Optional[str]
    context: Dict[str, Any]
    component: Optional[str]
    user_id: Optional[str]
    request_id: Optional[str]
    
    def to_dict(self) -> Dict:
        return asdict(self)


class StructuredLogger:
    """
    Structured logging with JSON format for log aggregation.
    Supports correlation IDs for request tracing.
    """
    
    def __init__(self, name: str, level: int = logging.INFO):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        self.context: Dict[str, Any] = {}
        self._local = threading.local()
    
    def set_context(self, **kwargs) -> None:
        """Set context that will be included in all log messages."""
        self.context.update(kwargs)
    
    def set_request_id(self, request_id: str) -> None:
        """Set request ID for the current thread."""
        self._local.request_id = request_id
    
    def get_request_id(self) -> Optional[str]:
        """Get request ID for the current thread."""
        return getattr(self._local, 'request_id', None)
    
    def _format_message(self, level: str, message: str, **extra) -> str:
        """Format log message as JSON."""
        log_data = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': level,
            'message': message,
            **self.context,
            **extra
        }
        
        request_id = self.get_request_id()
        if request_id:
            log_data['request_id'] = request_id
        
        return json.dumps(log_data, default=str)
    
    def debug(self, message: str, **extra) -> None:
        self.logger.debug(self._format_message('DEBUG', message, **extra))
    
    def info(self, message: str, **extra) -> None:
        self.logger.info(self._format_message('INFO', message, **extra))
    
    def warning(self, message: str, **extra) -> None:
        self.logger.warning(self._format_message('WARNING', message, **extra))
    
    def error(self, message: str, exception: Optional[Exception] = None, **extra) -> None:
        if exception:
            extra['error_type'] = type(exception).__name__
            extra['error_message'] = str(exception)
            extra['stack_trace'] = traceback.format_exc()
        self.logger.error(self._format_message('ERROR', message, **extra))
    
    def critical(self, message: str, exception: Optional[Exception] = None, **extra) -> None:
        if exception:
            extra['error_type'] = type(exception).__name__
            extra['error_message'] = str(exception)
            extra['stack_trace'] = traceback.format_exc()
        self.logger.critical(self._format_message('CRITICAL', message, **extra))


class SlackAlerter:
    """Send alerts to Slack webhook."""
    
    def __init__(self, webhook_url: Optional[str] = None):
        self.webhook_url = webhook_url or os.environ.get('SLACK_WEBHOOK_URL')
        self.enabled = bool(self.webhook_url)
        
        if not self.enabled:
            logger.warning("Slack alerting disabled - no webhook URL configured")
    
    def _get_color(self, level: AlertLevel) -> str:
        """Get Slack attachment color for alert level."""
        colors = {
            AlertLevel.DEBUG: "#808080",
            AlertLevel.INFO: "#36a64f",
            AlertLevel.WARNING: "#ffcc00",
            AlertLevel.ERROR: "#cc0000",
            AlertLevel.CRITICAL: "#8b0000"
        }
        return colors.get(level, "#808080")
    
    def send_alert(
        self,
        title: str,
        message: str,
        level: AlertLevel = AlertLevel.ERROR,
        fields: Optional[Dict[str, str]] = None
    ) -> bool:
        """Send alert to Slack."""
        if not self.enabled:
            return False
        
        try:
            attachment_fields = []
            if fields:
                for key, value in fields.items():
                    attachment_fields.append({
                        "title": key,
                        "value": value,
                        "short": len(str(value)) < 50
                    })
            
            payload = {
                "attachments": [{
                    "color": self._get_color(level),
                    "title": f"🚨 {title}",
                    "text": message,
                    "fields": attachment_fields,
                    "footer": "Learning Factory Monitor",
                    "ts": int(datetime.utcnow().timestamp())
                }]
            }
            
            response = requests.post(
                self.webhook_url,
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return True
            
        except Exception as e:
            logger.error(f"Failed to send Slack alert: {e}")
            return False


class ErrorMonitor:
    """
    Centralized error monitoring and alerting.
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
        
        self.sentry_enabled = False
        self.slack_alerter = SlackAlerter()
        self.error_queue: Queue = Queue()
        self.error_counts: Dict[str, int] = {}
        self._lock = threading.Lock()
        self._initialized = True
        
        # Initialize Sentry if available and configured
        self._init_sentry()
        
        # Start background error processor
        self._start_processor()
        
        logger.info("ErrorMonitor initialized")
    
    def _init_sentry(self) -> None:
        """Initialize Sentry SDK."""
        sentry_dsn = os.environ.get('SENTRY_DSN')
        
        if not SENTRY_AVAILABLE:
            logger.info("Sentry SDK not installed - error tracking disabled")
            return
        
        if not sentry_dsn:
            logger.info("SENTRY_DSN not configured - error tracking disabled")
            return
        
        try:
            sentry_logging = LoggingIntegration(
                level=logging.INFO,
                event_level=logging.ERROR
            )
            
            sentry_sdk.init(
                dsn=sentry_dsn,
                integrations=[sentry_logging],
                traces_sample_rate=0.1,
                environment=os.environ.get('ENVIRONMENT', 'development'),
                release=os.environ.get('APP_VERSION', 'unknown')
            )
            
            self.sentry_enabled = True
            logger.info("Sentry initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Sentry: {e}")
    
    def _start_processor(self) -> None:
        """Start background error processor thread."""
        def processor():
            while True:
                try:
                    event = self.error_queue.get()
                    if event is None:
                        break
                    self._process_error(event)
                except Exception as e:
                    logger.error(f"Error processor failed: {e}")
        
        thread = threading.Thread(target=processor, daemon=True)
        thread.start()
        
        atexit.register(lambda: self.error_queue.put(None))
    
    def _process_error(self, event: ErrorEvent) -> None:
        """Process an error event."""
        # Update error counts
        with self._lock:
            key = f"{event.component}:{event.error_type}"
            self.error_counts[key] = self.error_counts.get(key, 0) + 1
            count = self.error_counts[key]
        
        # Send to Sentry
        if self.sentry_enabled:
            try:
                sentry_sdk.capture_message(
                    event.message,
                    level=event.level,
                    extras=event.to_dict()
                )
            except:
                pass
        
        # Send Slack alert for errors and above
        if event.level in ['error', 'critical']:
            self.slack_alerter.send_alert(
                title=f"{event.error_type} in {event.component or 'Unknown'}",
                message=event.message,
                level=AlertLevel.ERROR if event.level == 'error' else AlertLevel.CRITICAL,
                fields={
                    "Component": event.component or "Unknown",
                    "Error Count": str(count),
                    "Timestamp": event.timestamp
                }
            )
    
    def capture_exception(
        self,
        exception: Exception,
        component: Optional[str] = None,
        context: Optional[Dict] = None,
        level: str = "error"
    ) -> None:
        """Capture and track an exception."""
        event = ErrorEvent(
            timestamp=datetime.utcnow().isoformat(),
            level=level,
            message=str(exception),
            error_type=type(exception).__name__,
            error_message=str(exception),
            stack_trace=traceback.format_exc(),
            context=context or {},
            component=component,
            user_id=None,
            request_id=None
        )
        
        self.error_queue.put(event)
        
        # Also log locally
        logger.error(f"[{component}] {type(exception).__name__}: {exception}")
    
    def capture_message(
        self,
        message: str,
        level: str = "info",
        component: Optional[str] = None,
        context: Optional[Dict] = None
    ) -> None:
        """Capture and track a message."""
        event = ErrorEvent(
            timestamp=datetime.utcnow().isoformat(),
            level=level,
            message=message,
            error_type="Message",
            error_message=message,
            stack_trace=None,
            context=context or {},
            component=component,
            user_id=None,
            request_id=None
        )
        
        self.error_queue.put(event)
    
    def get_error_stats(self) -> Dict:
        """Get error statistics."""
        with self._lock:
            return {
                'total_errors': sum(self.error_counts.values()),
                'by_type': dict(self.error_counts),
                'sentry_enabled': self.sentry_enabled,
                'slack_enabled': self.slack_alerter.enabled
            }


# Global instance
error_monitor = ErrorMonitor()


def monitor_errors(component: Optional[str] = None):
    """
    Decorator to automatically capture exceptions.
    
    Usage:
        @monitor_errors('harvester')
        def harvest_content():
            ...
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                error_monitor.capture_exception(
                    e,
                    component=component or func.__name__,
                    context={'args': str(args)[:100], 'kwargs': str(kwargs)[:100]}
                )
                raise
        return wrapper
    return decorator


# Health check endpoint data
def get_health_status() -> Dict:
    """Get system health status for health check endpoints."""
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'error_stats': error_monitor.get_error_stats(),
        'monitoring': {
            'sentry': error_monitor.sentry_enabled,
            'slack': error_monitor.slack_alerter.enabled
        }
    }


if __name__ == "__main__":
    # Test monitoring
    logging.basicConfig(level=logging.DEBUG)
    
    print("Testing error monitoring...")
    
    # Test structured logger
    slog = StructuredLogger("test")
    slog.set_context(app="learning_factory")
    slog.info("Test info message", extra_field="value")
    
    # Test exception capture
    try:
        raise ValueError("Test error")
    except Exception as e:
        error_monitor.capture_exception(e, component="test")
    
    print("\nError stats:", error_monitor.get_error_stats())
    print("Health status:", get_health_status())
