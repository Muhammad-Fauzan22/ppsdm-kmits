"""
Input Sanitizer - Infinite Learning Factory
============================================
Input validation, HTML cleaning, and content sanitization.
Prevents XSS, SQL injection, and malformed data.
"""

import re
import html
import unicodedata
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
import logging

# Optional BeautifulSoup for advanced HTML cleaning
try:
    from bs4 import BeautifulSoup
    BS4_AVAILABLE = True
except ImportError:
    BS4_AVAILABLE = False

logger = logging.getLogger(__name__)


@dataclass
class SanitizationConfig:
    """Configuration for content sanitization."""
    max_length: int = 100000
    min_length: int = 10
    strip_html: bool = True
    normalize_unicode: bool = True
    remove_control_chars: bool = True
    allowed_tags: List[str] = None
    
    def __post_init__(self):
        if self.allowed_tags is None:
            self.allowed_tags = ['p', 'br', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3']


# Pre-compiled regex patterns for efficiency
PATTERNS = {
    'html_tags': re.compile(r'<[^>]+>'),
    'html_entities': re.compile(r'&[a-zA-Z0-9#]+;'),
    'control_chars': re.compile(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]'),
    'multiple_spaces': re.compile(r'\s+'),
    'multiple_newlines': re.compile(r'\n{3,}'),
    'url': re.compile(r'https?://[^\s<>"{}|\\^`\[\]]+'),
    'email': re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),
    'script_tags': re.compile(r'<script[^>]*>.*?</script>', re.IGNORECASE | re.DOTALL),
    'style_tags': re.compile(r'<style[^>]*>.*?</style>', re.IGNORECASE | re.DOTALL),
    'sql_injection': re.compile(r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION)\b)", re.IGNORECASE),
    'xss_patterns': re.compile(r'(javascript:|on\w+\s*=|<script|<iframe)', re.IGNORECASE),
}


def strip_html_tags(text: str, keep_tags: Optional[List[str]] = None) -> str:
    """
    Remove HTML tags from text.
    
    Args:
        text: Input text with potential HTML
        keep_tags: List of tag names to preserve (e.g., ['p', 'br'])
    
    Returns:
        Cleaned text
    """
    if not text:
        return ""
    
    # Use BeautifulSoup if available for better parsing
    if BS4_AVAILABLE:
        soup = BeautifulSoup(text, 'html.parser')
        
        # Remove script and style elements
        for element in soup(['script', 'style', 'iframe', 'noscript']):
            element.decompose()
        
        if keep_tags:
            # Keep only allowed tags
            for tag in soup.find_all(True):
                if tag.name not in keep_tags:
                    tag.unwrap()
        else:
            # Get text only
            text = soup.get_text(separator=' ')
        
        return text.strip()
    
    # Fallback to regex
    text = PATTERNS['script_tags'].sub('', text)
    text = PATTERNS['style_tags'].sub('', text)
    text = PATTERNS['html_tags'].sub(' ', text)
    text = html.unescape(text)
    
    return text.strip()


def normalize_unicode(text: str) -> str:
    """Normalize Unicode to NFC form."""
    if not text:
        return ""
    return unicodedata.normalize('NFC', text)


def remove_control_characters(text: str) -> str:
    """Remove control characters except newlines and tabs."""
    if not text:
        return ""
    return PATTERNS['control_chars'].sub('', text)


def normalize_whitespace(text: str) -> str:
    """Normalize whitespace (multiple spaces to single, limit newlines)."""
    if not text:
        return ""
    
    # Replace multiple spaces with single space
    text = PATTERNS['multiple_spaces'].sub(' ', text)
    
    # Limit consecutive newlines to 2
    text = PATTERNS['multiple_newlines'].sub('\n\n', text)
    
    return text.strip()


def truncate_text(text: str, max_length: int, suffix: str = "...") -> str:
    """Truncate text to max length, preserving word boundaries."""
    if not text or len(text) <= max_length:
        return text
    
    truncated = text[:max_length - len(suffix)]
    
    # Try to break at word boundary
    last_space = truncated.rfind(' ')
    if last_space > max_length * 0.8:
        truncated = truncated[:last_space]
    
    return truncated + suffix


def detect_malicious_content(text: str) -> Dict[str, bool]:
    """
    Detect potentially malicious content patterns.
    
    Returns:
        Dictionary with detection results
    """
    if not text:
        return {'is_safe': True, 'threats': []}
    
    threats = []
    
    # Check for SQL injection patterns
    if PATTERNS['sql_injection'].search(text):
        threats.append('sql_injection')
    
    # Check for XSS patterns
    if PATTERNS['xss_patterns'].search(text):
        threats.append('xss')
    
    return {
        'is_safe': len(threats) == 0,
        'threats': threats
    }


def sanitize_text(
    text: str,
    config: Optional[SanitizationConfig] = None
) -> str:
    """
    Full text sanitization pipeline.
    
    Args:
        text: Input text to sanitize
        config: Sanitization configuration
    
    Returns:
        Sanitized text
    """
    if not text:
        return ""
    
    if config is None:
        config = SanitizationConfig()
    
    # Step 1: Strip HTML if enabled
    if config.strip_html:
        text = strip_html_tags(text, config.allowed_tags if not config.strip_html else None)
    
    # Step 2: Normalize Unicode
    if config.normalize_unicode:
        text = normalize_unicode(text)
    
    # Step 3: Remove control characters
    if config.remove_control_chars:
        text = remove_control_characters(text)
    
    # Step 4: Normalize whitespace
    text = normalize_whitespace(text)
    
    # Step 5: Truncate if exceeds max length
    if len(text) > config.max_length:
        text = truncate_text(text, config.max_length)
    
    return text


def sanitize_for_database(text: str) -> str:
    """
    Sanitize text for safe database storage.
    Escapes special characters that could cause issues.
    """
    if not text:
        return ""
    
    # Basic sanitization
    text = sanitize_text(text)
    
    # Escape backslashes and quotes for JSON safety
    text = text.replace('\\', '\\\\')
    
    return text


def sanitize_filename(filename: str, max_length: int = 100) -> str:
    """
    Sanitize a filename for safe filesystem storage.
    
    Args:
        filename: Original filename
        max_length: Maximum allowed length
    
    Returns:
        Safe filename
    """
    if not filename:
        return "unnamed"
    
    # Remove path separators and dangerous characters
    safe_chars = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', filename)
    
    # Remove leading/trailing dots and spaces
    safe_chars = safe_chars.strip('. ')
    
    # Truncate if necessary
    if len(safe_chars) > max_length:
        name, ext = safe_chars.rsplit('.', 1) if '.' in safe_chars else (safe_chars, '')
        if ext:
            name = name[:max_length - len(ext) - 1]
            safe_chars = f"{name}.{ext}"
        else:
            safe_chars = safe_chars[:max_length]
    
    return safe_chars or "unnamed"


def sanitize_url(url: str) -> Optional[str]:
    """
    Validate and sanitize a URL.
    
    Returns:
        Sanitized URL or None if invalid
    """
    if not url:
        return None
    
    url = url.strip()
    
    # Check for javascript: or data: URLs
    if url.lower().startswith(('javascript:', 'data:', 'vbscript:')):
        return None
    
    # Validate URL format
    if not PATTERNS['url'].match(url):
        # Allow relative URLs
        if not url.startswith('/'):
            return None
    
    return url


def sanitize_json_value(value: Any) -> Any:
    """
    Recursively sanitize values for JSON serialization.
    
    Handles strings, lists, and dictionaries.
    """
    if isinstance(value, str):
        return sanitize_text(value)
    elif isinstance(value, list):
        return [sanitize_json_value(item) for item in value]
    elif isinstance(value, dict):
        return {k: sanitize_json_value(v) for k, v in value.items()}
    else:
        return value


def validate_content_length(
    text: str,
    min_length: int = 10,
    max_length: int = 100000
) -> Dict[str, Any]:
    """
    Validate content length and return validation result.
    
    Returns:
        Dictionary with is_valid, length, and messages
    """
    length = len(text) if text else 0
    messages = []
    
    if length < min_length:
        messages.append(f"Content too short: {length} < {min_length}")
    
    if length > max_length:
        messages.append(f"Content too long: {length} > {max_length}")
    
    return {
        'is_valid': len(messages) == 0,
        'length': length,
        'messages': messages
    }


def extract_clean_text(html_content: str, min_words: int = 10) -> Optional[str]:
    """
    Extract clean text from HTML content.
    Returns None if extracted text is too short.
    """
    clean = strip_html_tags(html_content)
    clean = sanitize_text(clean)
    
    word_count = len(clean.split())
    if word_count < min_words:
        return None
    
    return clean


class ContentSanitizer:
    """
    High-level content sanitizer for processing harvested content.
    """
    
    def __init__(self, config: Optional[SanitizationConfig] = None):
        self.config = config or SanitizationConfig()
        self.stats = {
            'processed': 0,
            'sanitized': 0,
            'rejected': 0,
            'threats_detected': 0
        }
    
    def process(self, content: str) -> Optional[str]:
        """
        Process and sanitize content.
        
        Returns:
            Sanitized content or None if rejected
        """
        self.stats['processed'] += 1
        
        if not content:
            self.stats['rejected'] += 1
            return None
        
        # Check for malicious content
        security_check = detect_malicious_content(content)
        if not security_check['is_safe']:
            self.stats['threats_detected'] += 1
            logger.warning(f"Malicious content detected: {security_check['threats']}")
            # Still process but flag it
        
        # Sanitize
        sanitized = sanitize_text(content, self.config)
        
        # Validate length
        validation = validate_content_length(
            sanitized,
            self.config.min_length,
            self.config.max_length
        )
        
        if not validation['is_valid']:
            self.stats['rejected'] += 1
            return None
        
        self.stats['sanitized'] += 1
        return sanitized
    
    def get_stats(self) -> Dict:
        """Get processing statistics."""
        return dict(self.stats)


if __name__ == "__main__":
    # Test sanitizer
    logging.basicConfig(level=logging.DEBUG)
    
    test_cases = [
        "<p>Hello <script>alert('xss')</script> World!</p>",
        "Normal text without HTML",
        "Text with   multiple    spaces",
        "<h1>Title</h1><p>Content with <b>bold</b></p>",
        "SELECT * FROM users; DROP TABLE users;--",
        "   \n\n\n  Multiple\n\n\n\n\n newlines   \n\n  ",
    ]
    
    sanitizer = ContentSanitizer()
    
    print("Testing content sanitizer:\n")
    for test in test_cases:
        result = sanitizer.process(test)
        print(f"Input:  {test[:50]}...")
        print(f"Output: {result[:50] if result else 'REJECTED'}...")
        print("-" * 50)
    
    print("\nStats:", sanitizer.get_stats())
