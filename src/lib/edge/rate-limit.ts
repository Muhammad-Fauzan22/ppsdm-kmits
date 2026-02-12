/**
 * Edge Rate Limiting Utility
 * Uses Upstash Redis for distributed rate limiting
 * Free tier: 10,000 requests/day
 */

import { Redis } from '@upstash/redis/cloudflare';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)
const redis = Redis.fromEnv();

// Rate limiter configuration
// Allow 100 requests per 60 seconds per IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true,
  /**
   * Optional: Customize rate limit headers
   * @see https://upstash.com/docs/redis/sdks/ratelimit-ts
   */
});

/**
 * Check rate limit for a given request
 * @param request - The incoming request object
 * @returns Object containing success status and rate limit info
 */
export async function rateLimit(request: Request): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}> {
  // Get client IP from headers
  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Apply rate limit
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  return {
    success,
    remaining,
    reset: Math.floor(Number(reset) / 1000),
    limit,
  };
}

/**
 * Create a rate limit response
 * @param success - Whether the request is allowed
 * @param remaining - Number of requests remaining
 * @param reset - Unix timestamp when the limit resets
 * @returns Response object with appropriate status and headers
 */
export function createRateLimitResponse(
  success: boolean,
  remaining: number,
  reset: number
): Response {
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil(reset - Date.now() / 1000)),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
      },
    });
  }

  return new Response(null, {
    headers: {
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(reset),
    },
  });
}

/**
 * Memory-based rate limiter (fallback when Redis is not available)
 * Note: This is not distributed and should only be used for development
 */
class MemoryRatelimit {
  private store = new Map<string, { count: number; resetTime: number }>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  limit(ip: string): { success: boolean; limit: number; reset: number; remaining: number } {
    const now = Date.now();
    let entry = this.store.get(ip);

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + this.windowMs };
      this.store.set(ip, entry);
    }

    entry.count++;
    const remaining = Math.max(0, this.maxRequests - entry.count);
    const success = entry.count <= this.maxRequests;

    return {
      success,
      limit: this.maxRequests,
      reset: Math.floor(entry.resetTime / 1000),
      remaining,
    };
  }
}

// Memory-based fallback (for development without Redis)
const memoryRatelimit = new MemoryRatelimit(100, 60000);

/**
 * Get rate limiter (Redis or memory fallback)
 */
export function getRatelimit(redisAvailable: boolean = true) {
  if (redisAvailable) {
    return rateLimit;
  }
  return async (request: Request) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const result = memoryRatelimit.limit(ip);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  };
}
