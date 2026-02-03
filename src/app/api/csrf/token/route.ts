/**
 * CSRF TOKEN API ENDPOINT
 * 
 * Provides CSRF tokens for client-side forms
 * GET /api/csrf/token
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    generateCSRFTokenResponse,
    getSessionId,
    setCSRFCookie,
} from '@/lib/security/csrf';

/**
 * GET /api/csrf/token
 * Returns a CSRF token for the current session
 */
export async function GET(request: NextRequest) {
    try {
        // Get session ID
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    message: 'Anda harus login untuk mendapatkan token CSRF',
                },
                { status: 401 }
            );
        }

        // Get or generate session ID
        const sessionId = getSessionId(request) || user.id;

        // Generate CSRF token
        const tokenData = generateCSRFTokenResponse(sessionId);

        // Create response with CSRF token
        const response = NextResponse.json({
            success: true,
            csrfToken: tokenData.token,
            expiresAt: tokenData.expiresAt,
            maxAge: tokenData.maxAge,
        });

        // Set CSRF cookie
        setCSRFCookie(response, tokenData.token);

        // Add security headers
        response.headers.set('X-CSRF-Token', tokenData.token);
        response.headers.set('X-CSRF-Token-Expires', tokenData.expiresAt);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');

        return response;
    } catch (error) {
        console.error('CSRF token generation error:', error);

        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: 'Gagal membuat token CSRF',
            },
            { status: 500 }
        );
    }
}

/**
 * OPTIONS /api/csrf/token
 * Handle preflight requests
 */
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        },
    });
}
