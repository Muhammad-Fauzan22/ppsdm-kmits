import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateCSRF } from '@/lib/csrf';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMITS = {
  auth: { max: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  api: { max: 100, window: 60 * 1000 }, // 100 requests per minute
  general: { max: 1000, window: 60 * 1000 }, // 1000 requests per minute
};

// Check rate limit
function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment counter
  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Clean up expired rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') && pathname.includes('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Apply rate limiting based on route type
    let rateLimitConfig = RATE_LIMITS.general;

    if (pathname.startsWith('/api/auth/')) {
      rateLimitConfig = RATE_LIMITS.auth;
    } else if (pathname.startsWith('/api/')) {
      rateLimitConfig = RATE_LIMITS.api;
    }

    const rateLimitKey = `${ip}:${pathname}`;
    const rateLimitResult = checkRateLimit(
      rateLimitKey,
      rateLimitConfig.max,
      rateLimitConfig.window
    );

    if (!rateLimitResult.allowed) {
      console.warn('RATE_LIMIT_EXCEEDED', {
        ip,
        pathname,
        userAgent,
        limit: rateLimitConfig.max,
        window: rateLimitConfig.window,
      });

      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitConfig.max.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.max.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
    response.headers.set('X-DNS-Prefetch-Control', 'on');

    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "frame-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    // Log the request
    console.log('REQUEST', {
      method: request.method,
      pathname,
      ip,
      userAgent,
      rateLimitRemaining: rateLimitResult.remaining,
    });

    return response;

  } catch (error) {
    console.error('MIDDLEWARE_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      pathname,
      ip,
      userAgent,
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};