import { NextRequest, NextResponse } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
  },
};

// In-memory store for rate limiting (not production grade)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiter for login attempts
 */
export function authRateLimit(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const config = RATE_LIMIT_CONFIG.login;
  const now = Date.now();
  const resetTime = now + config.windowMs;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime };
    rateLimitStore.set(ip, entry);
  }

  // Check if rate limit exceeded
  if (entry.count >= config.max) {
    const retryAfter = Math.ceil((entry.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { 
        error: 'Too many login attempts. Please try again later.',
        retryAfter
      },
      { status: 429 }
    );
  }

  // Increment count and return remaining attempts
  entry.count++;
  
  return null;
}

/**
 * Middleware-like function for API routes
 */
export async function rateLimitMiddleware(req: Request): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}> {
  // Get IP address from request
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const config = RATE_LIMIT_CONFIG.login;
  const now = Date.now();
  const resetTime = now + config.windowMs;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime };
    rateLimitStore.set(ip, entry);
  }

  // Check if rate limit exceeded
  if (entry.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - Date.now()) / 1000),
    };
  }

  // Increment count and return remaining attempts
  entry.count++;
  
  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetTime: entry.resetTime,
  };
}