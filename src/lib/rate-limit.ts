import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate Limiting Module
 * 
 * Current implementation: In-memory (single-instance only)
 * 
 * ⚠️  PRODUCTION NOTE: For multi-instance deployments (e.g., Vercel serverless),
 * migrate to Redis-based rate limiting using @upstash/ratelimit:
 * 
 *   import { Ratelimit } from '@upstash/ratelimit';
 *   import { Redis } from '@upstash/redis';
 *   
 *   const ratelimit = new Ratelimit({
 *     redis: Redis.fromEnv(),
 *     limiter: Ratelimit.slidingWindow(5, '15 m'),
 *   });
 * 
 * Environment variables needed:
 *   UPSTASH_REDIS_REST_URL=...
 *   UPSTASH_REDIS_REST_TOKEN=...
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // 5 attempts per window
  },
  signup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,                    // 3 signups per hour per IP
  },
  api: {
    windowMs: 60 * 1000,       // 1 minute
    max: 100,                  // 100 requests per minute
  },
} as const;

type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

// In-memory store (not persistent across restarts or instances)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 10 minutes
let lastCleanup = Date.now();

function cleanupExpired(): void {
  const now = Date.now();
  if (now - lastCleanup < 10 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function checkLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  cleanupExpired();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: max - 1, resetTime: now + windowMs };
  }

  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetTime: entry.resetTime, retryAfter };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: max - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limiter for Next.js API route handlers.
 * Returns a NextResponse with 429 status if rate limit exceeded, or null if allowed.
 */
export function authRateLimit(
  request: NextRequest,
  type: RateLimitType = 'login'
): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const config = RATE_LIMIT_CONFIG[type];
  const key = `${type}:${ip}`;
  const result = checkLimit(key, config.max, config.windowMs);

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Terlalu banyak percobaan. Silakan coba lagi dalam ${result.retryAfter} detik.`,
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfter ?? 60),
          'X-RateLimit-Limit': String(config.max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Async rate limiter for use in API route bodies.
 * Returns an object with `allowed` flag and metadata.
 */
export async function rateLimitMiddleware(
  req: Request,
  type: RateLimitType = 'api'
): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const config = RATE_LIMIT_CONFIG[type];
  const key = `${type}:${ip}`;
  return checkLimit(key, config.max, config.windowMs);
}

/**
 * Check rate limit for a specific identifier (e.g., user ID or email).
 * Useful for per-user rate limiting beyond IP-based limits.
 */
export function checkUserRateLimit(
  identifier: string,
  type: RateLimitType = 'api'
): { allowed: boolean; remaining: number; resetTime: number; retryAfter?: number } {
  const config = RATE_LIMIT_CONFIG[type];
  const key = `user:${type}:${identifier}`;
  return checkLimit(key, config.max, config.windowMs);
}
