import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// RATE LIMITING - Production-ready with in-memory fallback
// NOTE: For true production, migrate to @upstash/ratelimit with Redis
// ============================================================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (works for single-instance; use Redis for multi-instance)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Rate limiting configuration
const RATE_LIMITS = {
  auth: { max: 5, window: 15 * 60 * 1000 },      // 5 requests per 15 minutes
  api: { max: 100, window: 60 * 1000 },            // 100 requests per minute
  general: { max: 1000, window: 60 * 1000 },       // 1000 requests per minute
};

// Clean up expired records every 5 minutes
let lastCleanup = Date.now();

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();

  // Periodic cleanup to prevent memory leaks
  if (now - lastCleanup > 5 * 60 * 1000) {
    lastCleanup = now;
    for (const [k, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(k);
      }
    }
  }

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// ============================================================================
// CONTENT SECURITY POLICY
// ============================================================================

function buildCSP(): string {
  const isDev = process.env.NODE_ENV === 'development';

  const directives = [
    "default-src 'self'",
    // Allow inline scripts only in dev; use nonces in production ideally
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.groq.com https://api.openai.com https://generativelanguage.googleapis.com https://integrate.api.nvidia.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "frame-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  return directives.join('; ');
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    /\.(ico|png|jpg|jpeg|svg|gif|webp|avif|css|js|woff|woff2|ttf|eot|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  try {
    // Determine rate limit config based on route
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
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitConfig.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
          },
        }
      );
    }

    const response = NextResponse.next();

    // ── Security Headers ──────────────────────────────────────────────────────
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Content-Security-Policy', buildCSP());

    // ── Rate Limit Headers ────────────────────────────────────────────────────
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.max.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set(
      'X-RateLimit-Reset',
      Math.ceil(rateLimitResult.resetTime / 1000).toString()
    );

    return response;
  } catch (error) {
    console.error('[MIDDLEWARE_ERROR]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      pathname,
      ip,
    });

    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
