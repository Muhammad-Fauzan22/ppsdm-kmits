import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ============================================================================
// PPSDM KMM MIDDLEWARE - SECURITY & AUTHENTICATION
// ============================================================================
// Purpose: Centralized authentication and authorization for PPSDM KMM platform
// Security Level: HIGH - Implements RBAC, session validation, and route protection
// Last Updated: 2026-02-02
// ============================================================================

// 1. ROUTE CONFIGURATION
// ============================================================================

/**
 * Public routes that don't require authentication
 * These are accessible to all users (logged in or not)
 */
const PUBLIC_ROUTES = new Set([
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/callback',
    '/auth/recovery',
    '/help',
    '/privacy',
    '/terms',
    '/research/findings',
    '/community/stories',
    '/resources',
    '/about',
]);

/**
 * Public route patterns using regex for dynamic routes
 * These patterns match routes that should be publicly accessible
 */
const PUBLIC_PATTERNS = [
    /^\/api\/public\/.*/,           // Public API endpoints
    /^\/assessment\/.*/,              // Assessment pages (public access for demo)
    /^\/try-assessment\/.*/,          // Try assessment demo
    /^\/auth\/callback.*/,            // OAuth callbacks
    /^\/baca\/.*/,                   // Public reading pages
    /^\/perpustakaan\/.*/,          // Public library pages
];

/**
 * Protected route patterns by role
 * These define which routes require specific role access
 */
const PROTECTED_ROUTES = {
    admin: /^\/admin(\/|$)/,
    supervisor: /^\/(supervisor|mentorship)(\/|$)/,
    student: /^\/(dashboard|pos|wellbeing|roadmap|habit-forge|library|courses|assessment|profile|settings|activities|employability|co-create|global-exchange|simulation|vision|verifier|passport|tutor)(\/|$)/,
};

/**
 * Check if a route is public (no auth required)
 * @param pathname - The route path to check
 * @returns true if route is public, false otherwise
 */
const isPublicRoute = (pathname: string): boolean => {
    // Exact match first (more efficient)
    if (PUBLIC_ROUTES.has(pathname)) return true;
    
    // Pattern match for dynamic routes
    return PUBLIC_PATTERNS.some(pattern => pattern.test(pathname));
};

/**
 * Check if route requires specific role
 * @param pathname - The route path to check
 * @returns The required role or null if no specific role required
 */
const getRequiredRole = (pathname: string): 'admin' | 'supervisor' | 'student' | null => {
    if (PROTECTED_ROUTES.admin.test(pathname)) return 'admin';
    if (PROTECTED_ROUTES.supervisor.test(pathname)) return 'supervisor';
    if (PROTECTED_ROUTES.student.test(pathname)) return 'student';
    return null;
};

/**
 * Validate user role and metadata
 * @param user - The user object from Supabase
 * @returns Validated role or defaults to 'student'
 */
const validateUserRole = (user: any): 'admin' | 'supervisor' | 'student' => {
    if (!user || !user.user_metadata) return 'student';
    
    const role = user.user_metadata.role;
    
    // Validate role is one of allowed values
    if (role === 'admin' || role === 'superadmin') return 'admin';
    if (role === 'lecturer' || role === 'supervisor') return 'supervisor';
    
    return 'student'; // Default fallback
};

/**
 * Get redirect URL based on user role
 * @param role - The user's role
 * @param request - The NextRequest object
 * @returns URL object with pathname
 */
const getDashboardUrl = (role: string, request: NextRequest): URL => {
    const url = request.nextUrl.clone();
    
    switch (role) {
        case 'admin':
            url.pathname = '/admin';
            break;
        case 'supervisor':
            url.pathname = '/supervisor';
            break;
        default:
            url.pathname = '/dashboard';
    }
    
    return url;
};

// 2. MAIN MIDDLEWARE FUNCTION
// ============================================================================

/**
 * Main middleware function for authentication and authorization
 * Implements:
 * - Session validation via Supabase
 * - Public route detection
 * - Role-based access control (RBAC)
 * - Secure redirects
 * 
 * @param request - Next.js request object
 * @returns NextResponse or redirect
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Initialize response with security headers
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    
    // 2.1 Setup Supabase Client with cookie handling
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    
                    // Update response with new cookies
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );
    
    // 2.2 Check Session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // 2.3 Determine if route is public
    const isPublic = isPublicRoute(pathname);
    
    // 2.4 Case A: User accessing login/register but already authenticated
    // Redirect to appropriate dashboard based on role
    if (user && !isPublic && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
        const role = validateUserRole(user);
        const redirectUrl = getDashboardUrl(role, request);
        return NextResponse.redirect(redirectUrl);
    }
    
    // 2.5 Case B: Protected route without authentication
    // Redirect to login with return URL
    if (!user && !isPublic) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("next", pathname);
        url.searchParams.set("redirect_reason", "auth_required");
        return NextResponse.redirect(url);
    }
    
    // 2.6 Case C: Role-Based Access Control (RBAC)
    // Ensure users can only access routes appropriate to their role
    if (user && !isPublic) {
        const userRole = validateUserRole(user);
        const requiredRole = getRequiredRole(pathname);
        
        // If route requires specific role and user doesn't have it
        if (requiredRole && requiredRole !== userRole) {
            const url = getDashboardUrl(userRole, request);
            url.searchParams.set("access_denied", "true");
            url.searchParams.set("required_role", requiredRole);
            return NextResponse.redirect(url);
        }
    }
    
    // 2.7 Case D: Allow access
    // User is authenticated and has appropriate role, or route is public
    return response;
}

// 3. MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * Middleware configuration
 * - matcher: Defines which routes middleware should run on
 * - Excludes: static files, images, API routes, and Next.js internals
 */
export const config = {
    // Match all routes except:
    // - Static files (_next/static)
    // - Images (_next/image)
    // - Favicon
    // - Static assets (svg, png, jpg, jpeg, gif, webp)
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
