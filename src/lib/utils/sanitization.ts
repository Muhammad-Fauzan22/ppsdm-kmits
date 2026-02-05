/**
 * INPUT SANITIZATION - PPSDM KMITS
 * 
 * Sanitize user input to prevent XSS, SQL injection, and other attacks
 * All user input should be sanitized before processing
 */

/**
 * Sanitize HTML to prevent XSS attacks
 * Uses a simple implementation without external dependencies
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Remove potentially dangerous tags and attributes
  let sanitized = html
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (except for images)
    .replace(/data:(?!image\/)/gi, '')
    // Remove vbscript:
    .replace(/vbscript:/gi, '')
    // Remove expression()
    .replace(/expression\s*\(/gi, '')
    // Remove eval()
    .replace(/eval\s*\(/gi, '');
  
  return sanitized;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove potentially dangerous characters
  let sanitized = input
    // Remove < and > (HTML tags)
    .replace(/[<>]/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\bon\w+\s*=/gi, '')
    // Remove eval and expression
    .replace(/eval\s*\(/gi, '')
    .replace(/expression\s*\(/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  return email.toLowerCase().trim();
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('URL protocol not allowed');
    }
    
    // Remove fragment and query params if needed
    return parsed.toString();
  } catch (error) {
    throw new Error('Invalid URL');
  }
}

/**
 * Sanitize assessment responses
 */
export function sanitizeAssessmentResponse(response: any): any {
  if (typeof response === 'string') {
    return sanitizeInput(response);
  }

  if (Array.isArray(response)) {
    return response.map(sanitizeAssessmentResponse);
  }

  if (typeof response === 'object' && response !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(response)) {
      // Skip internal keys
      if (key.startsWith('_')) {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeAssessmentResponse(value);
      }
    }
    return sanitized;
  }

  return response;
}

/**
 * Sanitize SQL query parameters
 * Note: This is a basic sanitization. Always use parameterized queries!
 */
export function sanitizeSqlParam(param: string): string {
  if (!param) return '';
  
  // Remove SQL injection patterns
  let sanitized = param
    // Remove comments
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    // Remove OR/AND conditions
    .replace(/\s+(OR|AND)\s+/gi, '')
    // Remove UNION
    .replace(/\s+UNION\s+/gi, '')
    // Remove SELECT, INSERT, UPDATE, DELETE, DROP
    .replace(/\s+(SELECT|INSERT|UPDATE|DELETE|DROP)\s+/gi, '');
  
  return sanitized.trim();
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(filename: string): string {
  if (!filename) return '';
  
  // Remove path traversal attempts
  let sanitized = filename
    .replace(/\.\./g, '')
    .replace(/\.\.+/g, '')
    .replace(/[\/\\]/g, '')
    // Remove null bytes
    .replace(/\0/g, '');
  
  return sanitized.trim();
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  
  // Keep only digits, +, -, space, and parentheses
  return phone.replace(/[^\d\+\-\s\(\)]/g, '').trim();
}

/**
 * Sanitize NRP (Nomor Registrasi Peserta Didik)
 */
export function sanitizeNRP(nrp: string): string {
  if (!nrp) return '';
  
  // Keep only digits
  return nrp.replace(/\D/g, '').trim();
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  
  // Remove special characters but keep spaces and common punctuation
  let sanitized = query
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  return sanitized.trim();
}

/**
 * Validate and sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options?: {
    skipKeys?: string[];
    sanitizeHtml?: boolean;
  }
): T {
  const sanitized: any = {};
  const skipKeys = options?.skipKeys || [];
  const shouldSanitizeHtml = options?.sanitizeHtml || false;
  
  for (const [key, value] of Object.entries(obj)) {
    // Skip specified keys
    if (skipKeys.includes(key)) {
      sanitized[key] = value;
      continue;
    }
    
    // Sanitize based on type
    if (typeof value === 'string') {
      if (shouldSanitizeHtml) {
        sanitized[key] = sanitizeHtml(value);
      } else {
        sanitized[key] = sanitizeInput(value);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => {
        if (typeof item === 'string') {
          return shouldSanitizeHtml ? sanitizeHtml(item) : sanitizeInput(item);
        }
        return item;
      });
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, options);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Sanitize request body
 */
export function sanitizeRequestBody<T extends Record<string, any>>(
  body: T,
  options?: {
    skipKeys?: string[];
    sanitizeHtml?: boolean;
  }
): T {
  return sanitizeObject(body, options);
}

/**
 * Escape HTML entities
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(text: string): string {
  if (!text) return '';
  
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    '&#039;': "'",
  };
  
  return text.replace(/&(amp|lt|gt|quot|#039);/g, m => map[m]);
}

/**
 * Validate and sanitize UUID
 */
export function sanitizeUUID(uuid: string): string {
  if (!uuid) return '';
  
  // Remove any non-hex characters except hyphens
  const sanitized = uuid.replace(/[^0-9a-fA-F-]/g, '');
  
  return sanitized.trim();
}

/**
 * Sanitize array of strings
 */
export function sanitizeStringArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .filter(item => typeof item === 'string')
    .map(item => sanitizeInput(item))
    .filter(item => item.length > 0);
}

/**
 * Sanitize pagination parameters
 */
export function sanitizePaginationParams(params: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}): {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
} {
  return {
    page: Math.max(1, Math.min(1000, params.page || 1)),
    limit: Math.max(1, Math.min(100, params.limit || 20)),
    sort: params.sort ? sanitizeInput(params.sort) : undefined,
    order: params.order && ['asc', 'desc'].includes(params.order) ? params.order as 'asc' | 'desc' : 'desc',
  };
}

/**
 * Sanitize and validate file upload
 */
export function sanitizeFileUpload(file: {
  name: string;
  size: number;
  type: string;
}): {
  name: string;
  size: number;
  type: string;
} {
  return {
    name: sanitizeFileName(file.name),
    size: Math.min(10 * 1024 * 1024, file.size), // Max 10MB
    type: file.type,
  };
}

/**
 * Remove null bytes from string
 */
export function removeNullBytes(str: string): string {
  if (!str) return '';
  
  return str.replace(/\0/g, '');
}

/**
 * Normalize whitespace
 */
export function normalizeWhitespace(str: string): string {
  if (!str) return '';
  
  return str
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/^\s+|\s+$/g, ''); // Trim
}

/**
 * Sanitize and truncate text
 */
export function sanitizeAndTruncate(
  text: string,
  maxLength: number,
  options?: {
    preserveWords?: boolean;
    ellipsis?: string;
  }
): string {
  if (!text) return '';
  
  let sanitized = sanitizeInput(text);
  
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  
  if (options?.preserveWords) {
    // Truncate at word boundary
    const words = sanitized.split(' ');
    let result = '';
    for (const word of words) {
      if ((result + ' ' + word).length <= maxLength - 3) {
        result += (result ? ' ' : '') + word;
      } else {
        break;
      }
    }
    return result + (options.ellipsis || '...');
  }
  
  // Simple truncation
  return sanitized.substring(0, maxLength - 3) + (options?.ellipsis || '...');
}

/**
 * Export all sanitization functions
 */
export default {
  sanitizeHtml,
  sanitizeInput,
  sanitizeEmail,
  sanitizeUrl,
  sanitizeAssessmentResponse,
  sanitizeSqlParam,
  sanitizeFileName,
  sanitizePhone,
  sanitizeNRP,
  sanitizeSearchQuery,
  sanitizeObject,
  sanitizeRequestBody,
  escapeHtml,
  unescapeHtml,
  sanitizeUUID,
  sanitizeStringArray,
  sanitizePaginationParams,
  sanitizeFileUpload,
  removeNullBytes,
  normalizeWhitespace,
  sanitizeAndTruncate,
};
