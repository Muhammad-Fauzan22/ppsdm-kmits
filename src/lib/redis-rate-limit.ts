import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Check if Redis is configured
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });
} else {
  console.warn('Redis not configured. Using in-memory rate limiter (not suitable for production with multiple instances).');
}

// Rate limit configurations
export const rateLimits = {
  // Strict: Login attempts and sensitive operations
  strict: redis 
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '5 m'), // 5 requests per 5 minutes
        analytics: true,
        prefix: '@upstash/ratelimit/strict',
      })
    : createMemoryRateLimiter(5, 5 * 60 * 1000),
  
  // Standard: API routes
  standard: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
        analytics: true,
        prefix: '@upstash/ratelimit/standard',
      })
    : createMemoryRateLimiter(100, 60 * 1000),
  
  // Generous: Public routes
  generous: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(1000, '1 m'), // 1000 requests per minute
        analytics: true,
        prefix: '@upstash/ratelimit/generous',
      })
    : createMemoryRateLimiter(1000, 60 * 1000),
  
  // Admin: Admin routes (more permissive but monitored)
  admin: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(500, '1 m'),
        analytics: true,
        prefix: '@upstash/ratelimit/admin',
      })
    : createMemoryRateLimiter(500, 60 * 1000),
};

export type RateLimitType = keyof typeof rateLimits;

/**
 * Check rate limit for a given identifier
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType = 'standard'
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const limiter = rateLimits[type];
  
  if ('limit' in limiter) {
    // Redis-based rate limiter
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } else {
    // Memory-based fallback
    return limiter.check(identifier);
  }
}

/**
 * Create in-memory rate limiter (fallback when Redis is not available)
 * WARNING: This is not suitable for production with multiple instances
 */
function createMemoryRateLimiter(maxRequests: number, windowMs: number) {
  const store = new Map<string, { count: number; resetTime: number }>();
  
  return {
    async check(identifier: string): Promise<{
      success: boolean;
      limit: number;
      remaining: number;
      reset: number;
    }> {
      const now = Date.now();
      const record = store.get(identifier);
      
      if (!record || now > record.resetTime) {
        // Reset or create new record
        store.set(identifier, {
          count: 1,
          resetTime: now + windowMs
        });
        
        return {
          success: true,
          limit: maxRequests,
          remaining: maxRequests - 1,
          reset: now + windowMs
        };
      }
      
      if (record.count >= maxRequests) {
        return {
          success: false,
          limit: maxRequests,
          remaining: 0,
          reset: record.resetTime
        };
      }
      
      record.count++;
      
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - record.count,
        reset: record.resetTime
      };
    }
  };
}

/**
 * Middleware wrapper for rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  type: RateLimitType = 'standard',
  identifierFn?: (req: NextRequest) => string
) {
  return async (req: NextRequest, ...args: any[]): Promise<NextResponse> => {
    // Get identifier (IP address or user ID)
    const identifier = identifierFn 
      ? identifierFn(req)
      : req.ip 
        || req.headers.get('x-forwarded-for')?.split(',')[0]
        || req.headers.get('x-real-ip')
        || 'anonymous';
    
    // Check rate limit
    const result = await checkRateLimit(identifier, type);
    
    if (!result.success) {
      console.warn('Rate limit exceeded:', {
        identifier,
        timestamp: new Date().toISOString()
      });
      
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please slow down and try again later',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
            'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000))
          }
        }
      );
    }
    
    // Call handler
    const response = await handler(req, ...args);
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', String(result.limit));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.reset));
    
    return response;
  };
}

/**
 * Rate limit specifically for Next.js middleware
 */
export async function middlewareRateLimit(
  req: NextRequest,
  type: RateLimitType = 'standard'
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const identifier = req.ip 
    || req.headers.get('x-forwarded-for')?.split(',')[0]
    || req.headers.get('x-real-ip')
    || 'anonymous';
  
  const result = await checkRateLimit(identifier, type);
  
  if (!result.success) {
    return {
      allowed: false,
      response: new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please slow down and try again later'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000))
          }
        }
      )
    };
  }
  
  return { allowed: true };
}
