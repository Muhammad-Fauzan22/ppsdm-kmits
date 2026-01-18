import { NextRequest, NextResponse } from 'next/server';

// Enhanced Security Middleware for Production
// Implements CSP, rate limiting, and security headers

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per window
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of rateLimitStore.entries()) {
            if (value.resetTime < now) {
                rateLimitStore.delete(key);
            }
        }
    }, RATE_LIMIT_WINDOW);
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || record.resetTime < now) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// Security headers configuration
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// Content Security Policy
const CSP_DIRECTIVES = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.groq.com wss://*.supabase.co https://api.dicebear.com https://assets.mixkit.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
];

// Protected routes that require authentication
const PROTECTED_ROUTES = [
    '/dashboard',
    '/profile',
    '/settings',
    '/admin',
    '/supervisor',
    '/api/profile',
    '/api/assessment-results',
    '/api/activities',
];

// Admin-only routes
const ADMIN_ROUTES = [
    '/admin',
    '/api/admin',
];

export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

    // Rate limiting for API routes
    if (pathname.startsWith('/api/')) {
        const { allowed, remaining } = checkRateLimit(ip);

        response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());

        if (!allowed) {
            return new NextResponse(
                JSON.stringify({ error: 'Too Many Requests', retryAfter: 60 }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': '60',
                    },
                }
            );
        }
    }

    // Apply security headers
    for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
        response.headers.set(header, value);
    }

    // Apply CSP header
    response.headers.set('Content-Security-Policy', CSP_DIRECTIVES.join('; '));

    // Check authentication for protected routes
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

    if (isProtectedRoute || isAdminRoute) {
        const authToken = request.cookies.get('sb-access-token')?.value ||
            request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!authToken) {
            // Redirect to login for page routes
            if (!pathname.startsWith('/api/')) {
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('redirect', pathname);
                return NextResponse.redirect(loginUrl);
            }

            // Return 401 for API routes
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // TODO: Verify token with Supabase and check admin role for admin routes
    }

    // Add request ID for tracing
    const requestId = crypto.randomUUID();
    response.headers.set('X-Request-ID', requestId);

    // Add timing header
    response.headers.set('X-Response-Time', Date.now().toString());

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
    ],
};
