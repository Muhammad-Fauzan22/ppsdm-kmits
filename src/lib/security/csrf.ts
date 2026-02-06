/**
 * CSRF PROTECTION - PPSDM KMITS
 * 
 * Cross-Site Request Forgery (CSRF) protection
 * Using token-based validation for state-changing requests
 * 
 * Open Source Solution: No external dependencies required
 */

import { createHash, randomBytes } from 'crypto';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * CSRF secret from environment
 * Must be at least 32 characters long
 * CRITICAL: This MUST be set in production environment
 */
const CSRF_SECRET = process.env.CSRF_SECRET || (() => {
  // Generate a secure default secret for development
  // In production, always set CSRF_SECRET environment variable
  const defaultSecret = 'ppsdm-kmits-default-csrf-secret-for-development-only-change-in-production';
  
  // Log warning in development mode
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '⚠️  CSRF_SECRET environment variable not set. Using default secret for development. ' +
      'For production, set CSRF_SECRET using: openssl rand -base64 32'
    );
  }
  
  return defaultSecret;
})();

// Validate secret length (only warn, don't throw error)
if (CSRF_SECRET.length < 32) {
  console.warn(
    '⚠️  CSRF_SECRET must be at least 32 characters long for security. ' +
    'Generate a secure secret using: openssl rand -base64 32'
  );
}

/**
 * Token expiration time (1 hour)
 */
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// ============================================================================
// TOKEN GENERATION
// ============================================================================

/**
 * Generate CSRF token
 * @param sessionId - User session identifier
 * @returns CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const timestamp = Date.now();
  const random = randomBytes(16).toString('hex');
  
  // Create signature: hash(sessionId + timestamp + random + secret)
  const signature = createHash('sha256')
    .update(sessionId)
    .update(timestamp.toString())
    .update(random)
    .update(CSRF_SECRET as string)
    .digest('hex');
  
  // Format: timestamp:random:signature
  return `${timestamp}:${random}:${signature}`;
}

/**
 * Validate CSRF token
 * @param sessionId - User session identifier
 * @param token - CSRF token to validate
 * @returns true if valid, false otherwise
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  if (!sessionId || !token) {
    return false;
  }
  
  try {
    const [timestamp, random, signature] = token.split(':');
    
    // Check token format
    if (!timestamp || !random || !signature) {
      return false;
    }
    
    // Check token age
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > TOKEN_EXPIRY_MS) {
      return false;
    }
    
    // Verify signature
    const expectedSignature = createHash('sha256')
      .update(sessionId)
      .update(timestamp)
      .update(random)
      .update(CSRF_SECRET as string)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('CSRF validation error:', error);
    return false;
  }
}

/**
 * Generate CSRF token for API response
 * @param sessionId - User session identifier
 * @returns Object with token and metadata
 */
export function generateCSRFTokenResponse(sessionId: string): {
  token: string;
  expiresAt: string;
  maxAge: number;
} {
  const token = generateCSRFToken(sessionId);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString();
  
  return {
    token,
    expiresAt,
    maxAge: Math.floor(TOKEN_EXPIRY_MS / 1000), // Convert to seconds
  };
}

// ============================================================================
// COOKIE MANAGEMENT
// ============================================================================

/**
 * CSRF cookie options
 */
export const CSRF_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: TOKEN_EXPIRY_MS / 1000, // Convert to seconds
};

/**
 * Set CSRF cookie
 * @param response - NextResponse object
 * @param token - CSRF token
 */
export function setCSRFCookie(
  response: Response,
  token: string
): void {
  const cookieValue = `csrf=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${CSRF_COOKIE_OPTIONS.maxAge}`;
  
  response.headers.set('Set-Cookie', cookieValue);
}

/**
 * Get CSRF token from cookie
 * @param request - Request object
 * @returns CSRF token or null
 */
export function getCSRFCookie(request: Request): string | null {
  const cookies = request.headers.get('cookie') || '';
  const csrfMatch = cookies.match(/csrf=([^;]+)/);
  
  return csrfMatch ? decodeURIComponent(csrfMatch[1]) : null;
}

/**
 * Clear CSRF cookie
 * @param response - Response object
 */
export function clearCSRFCookie(response: Response): void {
  const cookieValue = 'csrf=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  response.headers.set('Set-Cookie', cookieValue);
}

// ============================================================================
// MIDDLEWARE HELPERS
// ============================================================================

/**
 * Check if request should be protected by CSRF
 * @param method - HTTP method
 * @param pathname - Request pathname
 * @returns true if CSRF protection required
 */
export function requiresCSRFProtection(
  method: string,
  pathname: string
): boolean {
  // Only protect state-changing methods
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  if (!stateChangingMethods.includes(method.toUpperCase())) {
    return false;
  }
  
  // Skip CSRF for public API endpoints
  const publicPaths = [
    '/api/public/',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/callback',
  ];
  
  return !publicPaths.some(path => pathname.startsWith(path));
}

/**
 * Validate CSRF token from request
 * @param request - Request object
 * @returns true if valid, false otherwise
 */
export function validateCSRFRequest(request: Request): boolean {
  const sessionId = getSessionId(request);
  const token = getCSRFCookie(request);
  
  if (!sessionId || !token) {
    return false;
  }
  
  return validateCSRFToken(sessionId, token);
}

/**
 * Get session ID from request
 * @param request - Request object
 * @returns Session ID or null
 */
export function getSessionId(request: Request): string | null {
  // Try to get session ID from various sources
  const authHeader = request.headers.get('authorization');
  const cookieHeader = request.headers.get('cookie');
  
  // Extract from auth header (Bearer token)
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Use token as session ID (simplified)
    return token.substring(0, 32); // Use first 32 chars
  }
  
  // Extract from cookie
  if (cookieHeader) {
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    if (sessionMatch) {
      return decodeURIComponent(sessionMatch[1]);
    }
  }
  
  return null;
}

// ============================================================================
// API ROUTE HELPERS
// ============================================================================

/**
 * Get CSRF token for client
 * @param sessionId - User session identifier
 * @returns Response with CSRF token
 */
export function getCSRFTokenResponse(sessionId: string): Response {
  const tokenData = generateCSRFTokenResponse(sessionId);
  
  return new Response(
    JSON.stringify({
      success: true,
      csrfToken: tokenData.token,
      expiresAt: tokenData.expiresAt,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': tokenData.token,
        'X-CSRF-Token-Expires': tokenData.expiresAt,
      },
    }
  );
}

/**
 * Validate CSRF and return error if invalid
 * @param request - Request object
 * @returns Response or null if valid
 */
export function validateCSRFAndReturnError(request: Request): Response | null {
  if (!validateCSRFRequest(request)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid CSRF token',
        message: 'Token CSRF tidak valid atau telah kadaluarsa. Silakan refresh halaman.',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  return null;
}

// ============================================================================
// CLIENT-SIDE HELPERS
// ============================================================================

/**
 * Get CSRF token from server
 * @returns Promise with CSRF token
 */
export async function fetchCSRFToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/csrf/token', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.csrfToken || null;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
}

/**
 * Add CSRF token to request headers
 * @param headers - Request headers
 * @param token - CSRF token
 * @returns Updated headers
 */
export function addCSRFTokenToHeaders(
  headers: HeadersInit,
  token: string
): HeadersInit {
  return {
    ...headers,
    'X-CSRF-Token': token,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateCSRFToken,
  validateCSRFToken,
  generateCSRFTokenResponse,
  setCSRFCookie,
  getCSRFCookie,
  clearCSRFCookie,
  requiresCSRFProtection,
  validateCSRFRequest,
  getSessionId,
  getCSRFTokenResponse,
  validateCSRFAndReturnError,
  fetchCSRFToken,
  addCSRFTokenToHeaders,
  CSRF_COOKIE_OPTIONS,
  TOKEN_EXPIRY_MS,
};
