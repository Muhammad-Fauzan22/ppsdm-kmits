# TECHNICAL SPECIFICATIONS FOR FIXES - PPSDM KMITS
================================================

## 4.1 CODE EXAMPLES FOR FIXES

### 4.1.1 Rate Limiting Implementation

#### File: `src/middleware/rateLimiter.ts`
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create rate limiter instance
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 requests per 10 seconds
  analytics: true,
  prefix: "ppsdm_ratelimit",
});

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @throws Error if rate limit exceeded
 */
export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const { success, remaining, reset } = await ratelimit.limit(identifier);
  
  if (!success) {
    throw new RateLimitError("Terlalu banyak permintaan. Silakan coba lagi nanti.", {
      remaining,
      reset: new Date(reset).toISOString(),
    });
  }
  
  return { success, remaining, reset };
}

/**
 * Check rate limit for authentication endpoints (stricter)
 */
export async function checkAuthRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  const { success, remaining, reset } = await ratelimit.limit(
    `auth:${identifier}`,
    { limiter: Ratelimit.slidingWindow(3, "60 s") } // 3 requests per minute
  );
  
  if (!success) {
    throw new RateLimitError("Terlalu banyak percobaan login. Akun dikunci sementara.", {
      remaining,
      reset: new Date(reset).toISOString(),
    });
  }
  
  return { success, remaining, reset };
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public metadata: { remaining: number; reset: string }
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}
```

#### File: `src/middleware.ts`
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, checkAuthRateLimit } from './middleware/rateLimiter';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Get IP address
  const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';

  // Get user session
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || ip;

  try {
    // Apply rate limiting based on route
    if (request.nextUrl.pathname.startsWith('/api/auth/login') ||
        request.nextUrl.pathname.startsWith('/api/auth/signup')) {
      await checkAuthRateLimit(userId);
    } else if (request.nextUrl.pathname.startsWith('/api/')) {
      await checkRateLimit(userId);
    }

    return res;
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          error: error.message,
          remaining: error.metadata.remaining,
          reset: error.metadata.reset,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': error.metadata.remaining.toString(),
            'X-RateLimit-Reset': error.metadata.reset,
            'Retry-After': Math.ceil((new Date(error.metadata.reset).getTime() - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    return res;
  }
}

export const config = {
  matcher: '/api/:path*',
};
```

---

### 4.1.2 Service Role Key Security

#### File: `src/lib/supabase-admin.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

/**
 * SECURE ADMIN CLIENT
 * 
 * This client should ONLY be used in server-side code
 * and NEVER exposed to the client.
 * 
 * For client-side admin operations, use Supabase Edge Functions.
 */

// Validate environment
if (typeof window !== 'undefined') {
  throw new Error('supabaseAdmin can only be used on server side');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase admin credentials not configured');
}

// Create admin client with security settings
export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  supabaseServiceRoleKey, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-admin-operation': 'true',
      },
    },
  }
);

/**
 * Audit log for all admin operations
 */
export async function auditAdminOperation(params: {
  operation: string;
  userId?: string;
  details: Record<string, any>;
  ipAddress?: string;
}) {
  try {
    await supabaseAdmin.from('admin_audit_log').insert({
      operation: params.operation,
      user_id: params.userId || null,
      details: params.details,
      ip_address: params.ipAddress || 'unknown',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Failed to audit admin operation:', error);
    // Don't throw - audit failures shouldn't break operations
  }
}

/**
 * Wrapper for admin operations with automatic audit logging
 */
export async function withAdminAudit<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: { userId?: string; ipAddress?: string }
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    
    await auditAdminOperation({
      operation,
      userId: context?.userId,
      ipAddress: context?.ipAddress,
      details: {
        success: true,
        duration: Date.now() - startTime,
      },
    });
    
    return result;
  } catch (error) {
    await auditAdminOperation({
      operation,
      userId: context?.userId,
      ipAddress: context?.ipAddress,
      details: {
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
    
    throw error;
  }
}
```

#### File: `supabase/functions/admin-delete-user/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Verify request is from authorized source
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = authHeader.replace('Bearer ', '');
  
  // Verify token and get admin user
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!adminUser || adminUser.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Forbidden' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse request body
  const { userId: targetUserId } = await req.json();

  if (!targetUserId) {
    return new Response(
      JSON.stringify({ error: 'userId is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Delete user (with audit logging)
  const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUserId);
  
  if (deleteError) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Log audit
  await supabase.from('admin_audit_log').insert({
    operation: 'delete_user',
    user_id: user.id,
    target_user_id: targetUserId,
    ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    timestamp: new Date().toISOString(),
  });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
});
```

---

### 4.1.3 Input Validation with Zod

#### File: `src/lib/validation/schemas.ts`
```typescript
import { z } from 'zod';

/**
 * Authentication schemas
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password terlalu panjang')
    .regex(/[A-Z]/, 'Password harus mengandung huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
});

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email terlalu panjang')
    .transform(val => val.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password terlalu panjang')
    .regex(/[A-Z]/, 'Password harus mengandung huruf kapital')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  full_name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama terlalu panjang')
    .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi'),
  nrp: z
    .string()
    .min(10, 'NRP minimal 10 digit')
    .max(15, 'NRP maksimal 15 digit')
    .regex(/^\d+$/, 'NRP hanya boleh mengandung angka'),
  department: z
    .string()
    .min(2, 'Jurusan minimal 2 karakter')
    .max(100, 'Jurusan terlalu panjang'),
});

/**
 * Assessment schemas
 */
export const assessmentResponseSchema = z.object({
  questionId: z.string().uuid('ID pertanyaan tidak valid'),
  answer: z.union([
    z.string().max(1000, 'Jawaban terlalu panjang'),
    z.number().min(1).max(10),
    z.array(z.string().max(500)).max(10, 'Maksimal 10 pilihan'),
  ]),
  timestamp: z.string().datetime().optional(),
});

export const holisticAssessmentSchema = z.object({
  dimensionId: z
    .number()
    .int('ID dimensi harus bilangan bulat')
    .min(1, 'ID dimensi minimal 1')
    .max(9, 'ID dimensi maksimal 9'),
  responses: z
    .array(assessmentResponseSchema)
    .min(1, 'Minimal 1 jawaban')
    .max(100, 'Maksimal 100 jawaban'),
  userContext: z.object({
    age: z.number().int().min(0).max(120).optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    department: z.string().max(100).optional(),
    year: z.number().int().min(1).max(7).optional(),
  }).optional(),
});

/**
 * Course schemas
 */
export const courseEnrollmentSchema = z.object({
  courseId: z.string().uuid('ID kursus tidak valid'),
});

/**
 * User profile schemas
 */
export const userProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama terlalu panjang'),
  bio: z.string().max(500, 'Bio terlalu panjang').optional(),
  avatar_url: z.string().url('URL avatar tidak valid').optional(),
  department: z.string().max(100).optional(),
  year: z.number().int().min(1).max(7).optional(),
});

/**
 * Type exports
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type HolisticAssessmentInput = z.infer<typeof holisticAssessmentSchema>;
export type CourseEnrollmentInput = z.infer<typeof courseEnrollmentSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
```

#### File: `src/lib/utils/sanitization.ts`
```typescript
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  let sanitized = input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('URL protocol not allowed');
    }

    return parsed.toString();
  } catch (error) {
    throw new Error('Invalid URL');
  }
}

/**
 * Sanitize assessment responses
 */
export function sanitizeAssessmentResponse(response: any): any {
  if (typeof response === 'string') {
    return sanitizeInput(response);
  }

  if (Array.isArray(response)) {
    return response.map(sanitizeAssessmentResponse);
  }

  if (typeof response === 'object' && response !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(response)) {
      sanitized[key] = sanitizeAssessmentResponse(value);
    }
    return sanitized;
  }

  return response;
}
```

---

### 4.1.4 Error Boundary Component

#### File: `src/components/ErrorBoundary.tsx`
```typescript
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: 'true',
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            
            {/* Error Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Terjadi Kesalahan
            </h2>
            
            {/* Error Message */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah 
              diberitahu dan sedang bekerja untuk memperbaikinya.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                  Error Details (Development Only)
                </summary>
                <div className="mt-3 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-64">
                  <div className="mb-2">
                    <strong className="text-gray-700">Error:</strong>
                    <pre className="mt-1 text-red-600 whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-gray-700">Component Stack:</strong>
                      <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Support Contact */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Masih mengalami masalah? Hubungi{' '}
                <a 
                  href="mailto:support@ppsdm.its.ac.id"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@ppsdm.its.ac.id
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage example:
// <ErrorBoundary onError={(error, errorInfo) => {
//   // Custom error handling
//   logErrorToService(error, errorInfo);
// }}>
//   <YourComponent />
// </ErrorBoundary>
```

---

## 4.2 CONFIGURATION CHANGES

### 4.2.1 Enhanced Security Headers

#### File: `next.config.mjs`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. ENABLE STRICT LINTING
    typescript: {
        ignoreBuildErrors: false,
    },

    // 2. PERFORMANCE OPTIMIZATIONS
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'drive.google.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' }
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
        optimizeCss: true,
        scrollRestoration: true,
    },

    // 3. ENHANCED SECURITY HEADERS
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        // STRICT CSP with nonce support
                        value: [
                            "default-src 'self' *.its.ac.id *.supabase.co;",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.its.ac.id *.supabase.co;",
                            "style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com;",
                            "font-src 'self' fonts.gstatic.com fonts.googleapis.com;",
                            "img-src 'self' data: blob: *.its.ac.id *.supabase.co https://drive.google.com https://lh3.googleusercontent.com https://placehold.co;",
                            "connect-src 'self' *.supabase.co *.its.ac.id wss://*.supabase.co;",
                            "frame-ancestors 'self';",
                            "form-action 'self';",
                            "base-uri 'self';",
                            "manifest-src 'self';",
                            "worker-src 'self' blob:;",
                            "object-src 'none';",
                            "report-uri /csp-report"
                        ].join(' ')
                    },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
                    { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                    { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
                    { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
                ]
            },
            {
                source: '/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=60, stale-while-revalidate=300'
                    }
                ]
            }
        ];
    },

    // 4. WEBPACK OPTIMIZATION
    webpack: (config, { isServer }) => {
        // Optimize bundle size
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                    commons: {
                        name: 'commons',
                        chunks: 'all',
                        minChunks: 2,
                    },
                    charts: {
                        test: /[\\/]node_modules[\\/](chart\.js|recharts)[\\/]/,
                        name: 'charts',
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                    animations: {
                        test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
                        name: 'animations',
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                    ui: {
                        test: /[\\/]node_modules[\\/](@radix-ui|@headlessui)[\\/]/,
                        name: 'ui',
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                },
            },
        };

        return config;
    },

    // 5. ADDITIONAL OPTIMIZATIONS
    swcMinify: true,
    compress: true,
    poweredByHeader: false,

    distDir: '.next',
    trailingSlash: false,
};

export default nextConfig;
```

---

### 4.2.2 Environment Variables

#### File: `.env.example`
```bash
# ============================================
# PPSDM KMITS - Environment Variables
# ============================================

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# CSRF Protection
CSRF_SECRET=your-random-csrf-secret-min-32-chars

# Session Management
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PPSDM KMITS

# AI Services
OPENAI_API_KEY=your-openai-key
GOOGLE_AI_API_KEY=your-google-ai-key
HUGGINGFACE_API_KEY=your-huggingface-key

# Google Services
GOOGLE_DRIVE_CLIENT_ID=your-drive-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-drive-client-secret
GOOGLE_SHEETS_API_KEY=your-sheets-api-key

# Email Configuration (if using custom email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@ppsdm.its.ac.id

# Monitoring
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

# Feature Flags
NEXT_PUBLIC_ENABLE_REALTIME=true
NEXT_PUBLIC_ENABLE_OFFLINE=true
NEXT_PUBLIC_ENABLE_A_B_TESTING=false

# Development
NODE_ENV=development
LOG_LEVEL=debug
```

---

## 4.3 DATABASE OPTIMIZATION QUERIES

### 4.3.1 Optimized Assessment Queries

#### File: `supabase/migrations/xxx_optimize_assessment_queries.sql`
```sql
-- ============================================
-- OPTIMIZED ASSESSMENT QUERIES
-- ============================================

-- 1. Create optimized function to get user assessments with scores
CREATE OR REPLACE FUNCTION get_user_assessments_with_scores(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    dimension_id INTEGER,
    dimension_slug TEXT,
    composite_score NUMERIC,
    level TEXT,
    percentile NUMERIC,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ha.id,
        ha.dimension_id,
        ha.dimension_slug,
        ha.composite_score,
        ha.level,
        ha.percentile,
        ha.created_at
    FROM holistic_assessments ha
    WHERE ha.user_id = p_user_id
    ORDER BY ha.dimension_id, ha.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Create optimized function to get latest assessment per dimension
CREATE OR REPLACE FUNCTION get_latest_assessments_per_dimension(p_user_id UUID)
RETURNS TABLE (
    dimension_id INTEGER,
    assessment_id UUID,
    composite_score NUMERIC,
    level TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    WITH ranked_assessments AS (
        SELECT 
            ha.dimension_id,
            ha.id AS assessment_id,
            ha.composite_score,
            ha.level,
            ha.created_at,
            ROW_NUMBER() OVER (PARTITION BY ha.dimension_id ORDER BY ha.created_at DESC) AS rn
        FROM holistic_assessments ha
        WHERE ha.user_id = p_user_id
    )
    SELECT 
        dimension_id,
        assessment_id,
        composite_score,
        level,
        created_at
    FROM ranked_assessments
    WHERE rn = 1
    ORDER BY dimension_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- 3. Create optimized function to calculate overall holistic score
CREATE OR REPLACE FUNCTION calculate_overall_holistic_score(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    v_avg_score NUMERIC;
    v_completion_rate NUMERIC;
BEGIN
    -- Calculate average score
    SELECT AVG(composite_score) INTO v_avg_score
    FROM (
        SELECT composite_score
        FROM get_latest_assessments_per_dimension(p_user_id)
    ) AS latest_assessments;

    -- Calculate completion rate
    SELECT COUNT(*)::NUMERIC / 9.0 INTO v_completion_rate
    FROM get_latest_assessments_per_dimension(p_user_id);

    -- Return weighted score (average * completion rate)
    RETURN COALESCE(v_avg_score, 0) * COALESCE(v_completion_rate, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Create optimized function to get gap analysis
CREATE OR REPLACE FUNCTION get_gap_analysis(p_user_id UUID)
RETURNS TABLE (
    dimension_id INTEGER,
    dimension_name TEXT,
    current_score NUMERIC,
    target_score NUMERIC,
    gap NUMERIC,
    severity TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH latest_assessments AS (
        SELECT 
            ha.dimension_id,
            ha.composite_score AS current_score
        FROM holistic_assessments ha
        WHERE ha.user_id = p_user_id
        ORDER BY ha.created_at DESC
        LIMIT 9
    ),
    dimension_targets AS (
        SELECT 
            unnest(ARRAY[1,2,3,4,5,6,7,8,9]) AS dimension_id,
            55 AS target_score
    ),
    gaps AS (
        SELECT 
            COALESCE(la.dimension_id, dt.dimension_id) AS dimension_id,
            COALESCE(la.current_score, 0) AS current_score,
            dt.target_score,
            dt.target_score - COALESCE(la.current_score, 0) AS gap
        FROM dimension_targets dt
        LEFT JOIN latest_assessments la ON dt.dimension_id = la.dimension_id
    )
    SELECT 
        g.dimension_id,
        CASE g.dimension_id
            WHEN 1 THEN 'Kognitif & Intelektual'
            WHEN 2 THEN 'Manajemen Diri & Produktivitas'
            WHEN 3 THEN 'Kecerdasan Finansial'
            WHEN 4 THEN 'Kesehatan Fisik & Vitalitas'
            WHEN 5 THEN 'Kecerdasan Emosional & Sosial'
            WHEN 6 THEN 'Kesehatan Mental & Psikologis'
            WHEN 7 THEN 'Karakter & Etika'
            WHEN 8 THEN 'Pengembangan Spiritual'
            WHEN 9 THEN 'Manajemen Lingkungan & Gaya Hidup'
            ELSE 'Dimensi ' || g.dimension_id
        END AS dimension_name,
        g.current_score,
        g.target_score,
        g.gap,
        CASE 
            WHEN g.gap >= 30 THEN 'critical'
            WHEN g.gap >= 15 THEN 'moderate'
            WHEN g.gap > 0 THEN 'minor'
            ELSE 'none'
        END AS severity
    FROM gaps g
    ORDER BY g.gap DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_holistic_assessments_user_created 
    ON holistic_assessments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_holistic_assessments_dimension_created 
    ON holistic_assessments(dimension_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_holistic_assessments_user_dimension 
    ON holistic_assessments(user_id, dimension_id);

CREATE INDEX IF NOT EXISTS idx_holistic_assessments_composite_score 
    ON holistic_assessments(composite_score);

-- 6. Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
DROP TRIGGER IF EXISTS update_holistic_assessments_updated_at ON holistic_assessments;
CREATE TRIGGER update_holistic_assessments_updated_at 
    BEFORE UPDATE ON holistic_assessments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Create materialized view for dashboard stats
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT 
    COUNT(DISTINCT user_id) AS total_users,
    COUNT(*) AS total_assessments,
    AVG(composite_score) AS avg_score,
    COUNT(CASE WHEN composite_score >= 85 THEN 1 END) AS expert_count,
    COUNT(CASE WHEN composite_score >= 70 THEN 1 END) AS advanced_count,
    COUNT(CASE WHEN composite_score >= 55 THEN 1 END) AS intermediate_count,
    COUNT(CASE WHEN composite_score < 55 THEN 1 END) AS beginner_count
FROM holistic_assessments;

-- Create unique index for materialized view refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_unique 
    ON dashboard_stats ((true));

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (run this via cron job)
-- SELECT refresh_dashboard_stats();
```

---

### 4.3.2 Database Connection Pooling

#### File: `src/lib/db/pool.ts`
```typescript
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

/**
 * Database connection pool configuration
 * This helps manage database connections efficiently
 */

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
export const dbPool = new Pool(poolConfig);

/**
 * Execute a query with connection pooling
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await dbPool.connect();
  
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Execute a transaction with connection pooling
 */
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await dbPool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Health check for database pool
 */
export async function poolHealthCheck(): Promise<{
  total: number;
  idle: number;
  waiting: number;
}> {
  return {
    total: dbPool.totalCount,
    idle: dbPool.idleCount,
    waiting: dbPool.waitingCount,
  };
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await dbPool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await dbPool.end();
  process.exit(0);
});
```

---

## 4.4 TESTING CONFIGURATION

### 4.4.1 Vitest Configuration

#### File: `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vitest.setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

### 4.4.2 Playwright Configuration

#### File: `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

*End of Technical Specifications*
