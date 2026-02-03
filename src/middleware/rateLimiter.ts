/**
 * RATE LIMITING MIDDLEWARE - Open Source Solution
 * 
 * Menggunakan in-memory rate limiting untuk menghindari biaya Redis/Upstash
 * Cocok untuk deployment Vercel/Node.js dengan 0 biaya
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

// In-memory store (reset on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval to prevent memory leaks
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

// Clean up expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Rate limiter class
 */
export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request should be rate limited
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @returns Object with success status and remaining requests
   */
  check(identifier: string): {
    success: boolean;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // If no entry or window expired, create new entry
    if (!entry || entry.resetTime < now) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      rateLimitStore.set(identifier, newEntry);

      return {
        success: true,
        remaining: this.config.maxRequests - 1,
        reset: newEntry.resetTime,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
      success: true,
      remaining: this.config.maxRequests - entry.count,
      reset: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for a specific identifier
   * @param identifier - Unique identifier to reset
   */
  reset(identifier: string): void {
    rateLimitStore.delete(identifier);
  }

  /**
   * Get current rate limit status
   * @param identifier - Unique identifier
   */
  getStatus(identifier: string): {
    count: number;
    remaining: number;
    reset: number;
  } | null {
    const entry = rateLimitStore.get(identifier);
    if (!entry || entry.resetTime < Date.now()) {
      return null;
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      reset: entry.resetTime,
    };
  }
}

/**
 * Pre-configured rate limiters
 */

// Strict rate limiter for authentication endpoints
// 5 requests per 10 seconds
export const authRateLimiter = new RateLimiter({
  windowMs: 10 * 1000, // 10 seconds
  maxRequests: 5,
});

// Standard rate limiter for general API endpoints
// 100 requests per minute
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

// Lenient rate limiter for public endpoints
// 1000 requests per hour
export const publicRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
});

/**
 * Rate limit error class
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public metadata: {
      remaining: number;
      reset: number;
      retryAfter: number;
    }
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Check rate limit and throw error if exceeded
 * @param limiter - Rate limiter instance
 * @param identifier - Unique identifier
 * @param errorMessage - Custom error message
 */
export function checkRateLimit(
  limiter: RateLimiter,
  identifier: string,
  errorMessage: string = 'Terlalu banyak permintaan. Silakan coba lagi nanti.'
): void {
  const result = limiter.check(identifier);

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    throw new RateLimitError(errorMessage, {
      remaining: result.remaining,
      reset: result.reset,
      retryAfter,
    });
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try various headers for IP address
  const headers = request.headers;
  
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    headers.get('x-client-ip') ||
    'unknown'
  );
}

/**
 * Generate rate limit identifier from request
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  const ip = getClientIP(request);
  return `ip:${ip}`;
}
