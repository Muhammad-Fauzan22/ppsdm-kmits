import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Configure DOMPurify for server-side usage
const window = new JSDOM('').window;
const DOMPurifyServer = DOMPurify(window as any);

// XSS Protection Configuration
const XSS_CONFIG = {
  // Allowed tags
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr',
    'a', 'img', 'span', 'div'
  ],

  // Allowed attributes
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
    'data-*', 'aria-*', 'role'
  ],

  // Allowed URI schemes
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

  // Transform tags
  TRANSFORM_TAGS: {
    'a': (tagName: string, attribs: any) => {
      // Ensure external links open in new tab
      if (attribs.href && attribs.href.startsWith('http')) {
        attribs.target = '_blank';
        attribs.rel = 'noopener noreferrer';
      }
      return { tagName, attribs };
    }
  },

  // Forbidden tags (will be removed)
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],

  // Forbidden attributes
  FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress'],
};

// Initialize DOMPurify with configuration
const configureDOMPurify = () => {
  return {
    ALLOWED_TAGS: XSS_CONFIG.ALLOWED_TAGS,
    ALLOWED_ATTR: XSS_CONFIG.ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    ALLOWED_URI_REGEXP: XSS_CONFIG.ALLOWED_URI_REGEXP,
    TRANSFORM_TAGS: XSS_CONFIG.TRANSFORM_TAGS,
    FORBID_TAGS: XSS_CONFIG.FORBID_TAGS,
    FORBID_ATTR: XSS_CONFIG.FORBID_ATTR,
    SANITIZE_DOM: false, // We're sanitizing strings, not DOM
    KEEP_CONTENT: true,
    IN_PLACE: false,
  };
};

// Sanitize HTML content
export function sanitizeHtml(dirty: string, options: any = {}): string {
  try {
    const config = { ...configureDOMPurify(), ...options };
    return DOMPurifyServer.sanitize(dirty, config);
  } catch (error) {
    console.error('HTML sanitization error:', error);
    // Return safe fallback
    return DOMPurifyServer.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }
}

// Sanitize user input for different contexts
export const sanitizeInput = {
  // For plain text (no HTML allowed)
  text: (input: string): string => {
    if (typeof input !== 'string') return '';
    return input.replace(/[<>]/g, '').trim();
  },

  // For comments (limited HTML)
  comment: (input: string): string => {
    return sanitizeHtml(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code'],
      ALLOWED_ATTR: [],
    });
  },

  // For rich text content
  richText: (input: string): string => {
    return sanitizeHtml(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['class'],
    });
  },

  // For URLs
  url: (input: string): string => {
    if (typeof input !== 'string') return '';

    // Basic URL validation and sanitization
    const url = input.trim();

    // Check for dangerous protocols
    if (url.match(/^javascript:/i) || url.match(/^data:/i) || url.match(/^vbscript:/i)) {
      return '';
    }

    // Ensure https for external links
    if (url.startsWith('http://')) {
      console.warn('HTTP URL detected, consider upgrading to HTTPS:', url);
    }

    return url;
  },

  // For email addresses
  email: (input: string): string => {
    if (typeof input !== 'string') return '';

    const email = input.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '';
    }

    return email;
  },

  // For filenames
  filename: (input: string): string => {
    if (typeof input !== 'string') return '';

    // Remove path traversal and dangerous characters
    return input
      .replace(/(\.\.[\/\\])|([\/\\])/g, '')
      .replace(/[<>:*?"|]/g, '')
      .trim();
  },

  // For search queries
  search: (input: string): string => {
    if (typeof input !== 'string') return '';

    // Remove SQL injection patterns and other dangerous characters
    return input
      .replace(/['";\\]/g, '')
      .replace(/(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi, '')
      .trim();
  },
};

// XSS detection utilities
export const xssDetection = {
  // Check for common XSS patterns
  hasXSSPatterns: (input: string): boolean => {
    if (typeof input !== 'string') return false;

    const patterns = [
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /<form[^>]*>/gi,
      /<input[^>]*>/gi,
      /expression\s*\(/gi,
      /vbscript\s*:/gi,
      /data\s*:\s*text/gi,
    ];

    return patterns.some(pattern => pattern.test(input));
  },

  // Check for encoded XSS attempts
  hasEncodedXSS: (input: string): boolean => {
    if (typeof input !== 'string') return false;

    // Check for HTML entity encoded attacks
    const decoded = input
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#40;/g, '(')
      .replace(/&#41;/g, ')')
      .replace(/&#39;/g, "'");

    return xssDetection.hasXSSPatterns(decoded);
  },

  // Comprehensive XSS check
  isXSSAttempt: (input: string): { isSafe: boolean; threats: string[] } => {
    const threats: string[] = [];

    if (xssDetection.hasXSSPatterns(input)) {
      threats.push('XSS patterns detected');
    }

    if (xssDetection.hasEncodedXSS(input)) {
      threats.push('Encoded XSS attempt detected');
    }

    // Check for suspicious Unicode characters
    if (input.includes('\u2028') || input.includes('\u2029')) {
      threats.push('Suspicious Unicode characters detected');
    }

    // Check for extremely long strings (potential DoS)
    if (input.length > 10000) {
      threats.push('Input too long, possible DoS attempt');
    }

    return {
      isSafe: threats.length === 0,
      threats,
    };
  },
};

// Content Security Policy helpers
export const cspUtils = {
  // Generate CSP header
  generateCSP: (options: {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    connectSrc?: string[];
    fontSrc?: string[];
    objectSrc?: string[];
    mediaSrc?: string[];
    frameSrc?: string[];
    reportUri?: string;
  } = {}): string => {
    const {
      defaultSrc = ["'self'"],
      scriptSrc = ["'self'", "'unsafe-inline'"],
      styleSrc = ["'self'", "'unsafe-inline'"],
      imgSrc = ["'self'", 'data:', 'https:'],
      connectSrc = ["'self'"],
      fontSrc = ["'self'"],
      objectSrc = ["'none'"],
      mediaSrc = ["'self'"],
      frameSrc = ["'none'"],
      reportUri,
    } = options;

    const directives = [
      `default-src ${defaultSrc.join(' ')}`,
      `script-src ${scriptSrc.join(' ')}`,
      `style-src ${styleSrc.join(' ')}`,
      `img-src ${imgSrc.join(' ')}`,
      `connect-src ${connectSrc.join(' ')}`,
      `font-src ${fontSrc.join(' ')}`,
      `object-src ${objectSrc.join(' ')}`,
      `media-src ${mediaSrc.join(' ')}`,
      `frame-src ${frameSrc.join(' ')}`,
    ];

    if (reportUri) {
      directives.push(`report-uri ${reportUri}`);
    }

    return directives.join('; ');
  },

  // Validate CSP compliance
  validateCSP: (csp: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];

    // Check for dangerous directives
    if (csp.includes("'unsafe-inline'")) {
      issues.push("CSP allows 'unsafe-inline' scripts");
    }

    if (csp.includes("'unsafe-eval'")) {
      issues.push("CSP allows 'unsafe-eval'");
    }

    if (csp.includes("*")) {
      issues.push("CSP uses wildcard (*) which reduces security");
    }

    if (!csp.includes("default-src")) {
      issues.push("CSP missing default-src directive");
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },
};

// Input validation with XSS protection
export const validateAndSanitize = {
  // Validate and sanitize form input
  formInput: (input: string, type: keyof typeof sanitizeInput = 'text'): {
    sanitized: string;
    isValid: boolean;
    warnings: string[];
  } => {
    const xssCheck = xssDetection.isXSSAttempt(input);

    let sanitized = '';
    switch (type) {
      case 'text':
        sanitized = sanitizeInput.text(input);
        break;
      case 'comment':
        sanitized = sanitizeInput.comment(input);
        break;
      case 'richText':
        sanitized = sanitizeInput.richText(input);
        break;
      case 'url':
        sanitized = sanitizeInput.url(input);
        break;
      case 'email':
        sanitized = sanitizeInput.email(input);
        break;
      case 'filename':
        sanitized = sanitizeInput.filename(input);
        break;
      case 'search':
        sanitized = sanitizeInput.search(input);
        break;
      default:
        sanitized = sanitizeInput.text(input);
    }

    return {
      sanitized,
      isValid: xssCheck.isSafe,
      warnings: xssCheck.threats,
    };
  },

  // Validate file upload
  fileUpload: (file: File): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      issues.push(`File size ${file.size} exceeds maximum ${maxSize} bytes`);
    }

    if (!allowedTypes.includes(file.type)) {
      issues.push(`File type ${file.type} not allowed`);
    }

    // Check filename for XSS
    const filenameCheck = xssDetection.isXSSAttempt(file.name);
    if (!filenameCheck.isSafe) {
      issues.push('Filename contains suspicious characters');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  },
};

// Security headers utilities
export const securityHeaders = {
  // Generate security headers
  generate: (): Record<string, string> => {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
      'Content-Security-Policy': cspUtils.generateCSP(),
    };
  },

  // Apply security headers to response
  applyToResponse: (response: Response): Response => {
    const headers = securityHeaders.generate();

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },
};

// Export utilities
export {
  XSS_CONFIG,
  configureDOMPurify,
  sanitizeInput,
  xssDetection,
  cspUtils,
  validateAndSanitize,
  securityHeaders,
};
