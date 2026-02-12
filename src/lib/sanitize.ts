/**
 * Sanitization utilities for XSS protection
 */

import DOMPurify from 'dompurify';

// For server-side usage
export function sanitizeHtml(dirty: string): string {
  // Robust check for browser environment
  if (typeof window === 'undefined' || !window.document || !window.document.createElement) {
    // Server-side: return as-is (SSG/SSR)
    return dirty;
  }

  // Client-side: use DOMPurify
  // Handle potential export mismatch (ESM/CJS/Webpack)
  const sanitizer = (DOMPurify as any).default || DOMPurify;

  if (typeof sanitizer.sanitize === 'function') {
    return sanitizer.sanitize(dirty);
  }

  // If it's a factory function (Node environment leaking into check)
  if (typeof sanitizer === 'function') {
    const instance = sanitizer(window);
    if (instance && typeof instance.sanitize === 'function') {
      return instance.sanitize(dirty);
    }
  }

  // Fallback
  return dirty;
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: remove HTML tags
    return html.replace(/<[^>]*>/g, '');
  }
  // Client-side: use DOM
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Allow http/https
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }

  // Block unsafe protocols
  if (trimmed.match(/^(javascript|vbscript|data):/i)) {
    if (typeof console !== 'undefined') console.warn('Blocked unsafe URL protocol');
    return '';
  }

  return trimmed;
}

export function sanitizeSqlInput(input: string): string {
  if (!input) return '';
  // Basic SQL injection protection - removing common SQL keywords and characters
  // This is a naive implementation; proper parameterized queries should always be used
  return input
    .replace(/SELECT|INSERT|UPDATE|DELETE|DROP|UNION|FROM|WHERE|--|;/gi, '')
    .replace(/\x00/g, '');
}

export function validateAndSanitizeInput(
  input: string,
  options: {
    maxLength?: number;
    required?: boolean;
    allowHtml?: boolean
  } = {}
): string | null {
  if (input === null || input === undefined) {
    return options.required ? null : '';
  }

  let processed = String(input).trim();

  if (!processed && options.required) {
    return null;
  }

  if (options.maxLength && processed.length > options.maxLength) {
    processed = processed.substring(0, options.maxLength);
  }

  if (!options.allowHtml) {
    processed = stripHtml(processed);
  } else {
    processed = sanitizeHtml(processed);
  }

  return processed;
}

export function sanitizeRichText(html: string): string {
  if (typeof window === 'undefined' || !window.document) return html;

  const sanitizer = (DOMPurify as any).default || DOMPurify;
  let p = sanitizer;

  if (typeof p.sanitize !== 'function' && typeof p === 'function') {
    p = p(window);
  }

  if (typeof p.sanitize === 'function') {
    return p.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'class', 'style']
    });
  }

  return html;
}

// React hooks
export function useSanitizedHtml(html: string) {
  return { __html: sanitizeHtml(html) };
}

export function useSanitizedRichText(html: string) {
  return { __html: sanitizeRichText(html) };
}
