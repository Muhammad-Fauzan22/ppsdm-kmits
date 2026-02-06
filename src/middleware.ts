/**
 * Edge Middleware for PPSDM KMM
 * Provides rate limiting, caching, and security at the edge
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// IP-based rate limiting store (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Paths that bypass rate limiting
const BYPASS_PATHS = [
  '/api/health',
  '/api/ping',
  '/_next',
  '/_vercel',
  '/static',
  '/favicon.ico',
];

// Paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/api/user',
  '/api/assessment',
];

// Caching configuration for different paths
const CACHE_CONFIG: Record<string, { maxAge: number; staleWhileRevalidate: number }> = {
  '/api/public': { maxAge: 60, staleWhileRevalidate: 300 },
  '/api/static': { maxAge: 3600, staleWhileRevalidate: 86400 },
  '/assessment': { maxAge: 0, staleWhileRevalidate: 0 }, // No cache for assessments
};

// Helper function to check rate limit
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    // Reset or create new entry
    entry = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitMap.set(ip, entry);
  }
  
  // Increment counter
  entry.count++;
  
  // Check if allowed
  const allowed = entry.count <= RATE_LIMIT_MAX_REQUESTS;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  
  return { allowed, remaining, resetTime: entry.resetTime };
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Check various headers for the client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Helper function to check if path matches pattern
function matchesPath(path: string, pattern: string): boolean {
  if (pattern.endsWith('*')) {
    const basePath = pattern.slice(0, -1);
    return path.startsWith(basePath);
  }
  return path === pattern;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  
  // 1. Security Headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  // HSTS header (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // 2. Rate Limiting
  const shouldBypass = BYPASS_PATHS.some(path => matchesPath(pathname, path));
  
  if (!shouldBypass) {
    const { allowed, remaining, resetTime } = checkRateLimit(ip);
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime / 1000)));
    
    if (!allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        statusText: 'Too Many Requests',
        headers: {
          'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          ...Object.fromEntries(response.headers),
        },
      });
    }
  }
  
  // 3. Caching Strategy
  // Apply caching based on path
  for (const [pattern, config] of Object.entries(CACHE_CONFIG)) {
    if (matchesPath(pathname, pattern)) {
      if (config.maxAge > 0) {
        response.headers.set(
          'Cache-Control',
          `public, max-age=${config.maxAge}, s-maxage=${config.maxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`
        );
      }
      break;
    }
  }
  
  // 4. Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  // 5. Geo-location headers (for personalization)
  const country = request.headers.get('cf-ipcountry');
  if (country) {
    response.headers.set('X-Geo-Country', country);
  }
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
