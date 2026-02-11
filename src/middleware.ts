/**
 * Edge Middleware for PPSDM KMM
 * Provides rate limiting, caching, and security at the edge
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { middlewareRateLimit, RateLimitType } from '@/lib/redis-rate-limit';

// Paths that bypass rate limiting
const BYPASS_PATHS = [
  '/api/health',
  '/api/ping',
  '/_next',
  '/_vercel',
  '/static',
  '/favicon.ico',
];

// Paths that require stricter rate limiting
const STRICT_PATHS = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
];

// Admin paths
const ADMIN_PATHS = [
  '/api/admin/',
];

// Public paths with generous limits
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/public/',
];

// Caching configuration for different paths
const CACHE_CONFIG: Record<string, { maxAge: number; staleWhileRevalidate: number }> = {
  '/api/public': { maxAge: 60, staleWhileRevalidate: 300 },
  '/api/static': { maxAge: 3600, staleWhileRevalidate: 86400 },
  '/assessment': { maxAge: 0, staleWhileRevalidate: 0 }, // No cache for assessments
};

// Helper function to check if path matches pattern
function matchesPath(path: string, pattern: string): boolean {
  if (pattern.endsWith('*')) {
    const basePath = pattern.slice(0, -1);
    return path.startsWith(basePath);
  }
  return path === pattern;
}

// Determine rate limit type based on path
function getRateLimitType(pathname: string): RateLimitType {
  if (STRICT_PATHS.some(path => matchesPath(pathname, path))) {
    return 'strict';
  }
  if (ADMIN_PATHS.some(path => matchesPath(pathname, path))) {
    return 'admin';
  }
  if (PUBLIC_PATHS.some(path => matchesPath(pathname, path))) {
    return 'generous';
  }
  return 'standard';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Rate Limiting (using Redis or fallback)
  const shouldBypass = BYPASS_PATHS.some(path => matchesPath(pathname, path));
  
  if (!shouldBypass) {
    const rateLimitType = getRateLimitType(pathname);
    const { allowed, response } = await middlewareRateLimit(request, rateLimitType);
    
    if (!allowed && response) {
      return response;
    }
  }
  
  // 2. Security Headers
  const response = NextResponse.next();
  
  // Essential security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS header (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Generate nonce for CSP using Web Crypto API (Edge Runtime compatible)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const nonce = btoa(String.fromCharCode(...array));
  
  // Content Security Policy (CSP) - Strict without unsafe-inline/eval
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://*.supabase.co https://*.upstash.io;
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self' https://*.supabase.co https://*.upstash.io;
    media-src 'self';
    object-src 'none';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
    report-uri /api/csp-report;
  `.replace(/\s+/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // 3. Caching Strategy
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
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
