import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// CSRF token configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_NAME = 'csrf-token';
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Generate a secure random CSRF token
export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

// CSRF middleware for API routes
export function validateCSRF(request: NextRequest): { valid: boolean; error?: string } {
  // Skip CSRF validation for safe HTTP methods
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(request.method)) {
    return { valid: true };
  }

  try {
    // Get token from header
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    // Get token from cookie
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

    // Check if both tokens exist
    if (!headerToken || !cookieToken) {
      return {
        valid: false,
        error: 'CSRF token missing from request'
      };
    }

    // Check if tokens match
    if (headerToken !== cookieToken) {
      return {
        valid: false,
        error: 'CSRF token mismatch'
      };
    }

    // Check token format (should be hex)
    if (!/^[a-f0-9]{64}$/.test(headerToken)) {
      return {
        valid: false,
        error: 'Invalid CSRF token format'
      };
    }

    return { valid: true };

  } catch (error) {
    return {
      valid: false,
      error: 'CSRF validation error'
    };
  }
}

// Create CSRF protected response with token
export function createCSRFProtectedResponse(
  data: any,
  options: { status?: number } = {}
): NextResponse {
  const token = generateCSRFToken();

  const response = NextResponse.json(data, {
    status: options.status || 200,
    headers: {
      'Set-Cookie': `${CSRF_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
    },
  });

  return response;
}

// CSRF token endpoint handler
export async function handleCSRFTokenRequest(request: NextRequest) {
  try {
    const token = generateCSRFToken();

    const response = NextResponse.json(
      { csrfToken: token },
      {
        headers: {
          'Set-Cookie': `${CSRF_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
        },
      }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

// CSRF error response
export function createCSRFErrorResponse(error: string) {
  return NextResponse.json(
    {
      error: 'CSRF validation failed',
      message: error,
      code: 'CSRF_VALIDATION_ERROR'
    },
    { status: 403 }
  );
}

// Middleware wrapper for CSRF protection
export function withCSRFProtection(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const csrfValidation = validateCSRF(request);

    if (!csrfValidation.valid) {
      return createCSRFErrorResponse(csrfValidation.error || 'Invalid CSRF token');
    }

    return handler(request, ...args);
  };
}

// React hook for CSRF token management
export function useCSRFToken() {
  // This would be implemented in a React component
  // to fetch and manage CSRF tokens on the client side
}

// CSRF token utilities for forms
export const csrfUtils = {
  // Get token from meta tag (server-rendered)
  getTokenFromMeta(): string | null {
    if (typeof document === 'undefined') return null;
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag?.getAttribute('content') || null;
  },

  // Get token from cookie (client-side)
  getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === CSRF_COOKIE_NAME) {
        return value;
      }
    }
    return null;
  },

  // Add CSRF token to fetch requests
  addToFetchOptions(options: RequestInit = {}): RequestInit {
    const token = this.getTokenFromCookie();
    if (!token) {
      return options;
    }

    return {
      ...options,
      headers: {
        ...options.headers,
        [CSRF_HEADER_NAME]: token,
      },
    };
  },
};

// CSRF protection for Next.js API routes
export function createCSRFProtectedAPI(handler: Function) {
  return async (request: NextRequest, context: any) => {
    // Validate CSRF token
    const csrfValidation = validateCSRF(request);

    if (!csrfValidation.valid) {
      return createCSRFErrorResponse(csrfValidation.error || 'Invalid CSRF token');
    }

    // Call the original handler
    return handler(request, context);
  };
}

// CSRF protection for server actions
export function withCSRFAction(action: Function) {
  return async (formData: FormData, ...args: any[]) => {
    // For server actions, CSRF validation is typically handled
    // through the request headers or form data
    // This is a simplified implementation

    const csrfToken = formData.get('csrfToken') as string;

    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    // In a real implementation, you'd validate against a stored token
    // For now, we'll just check the format
    if (!/^[a-f0-9]{64}$/.test(csrfToken)) {
      throw new Error('Invalid CSRF token format');
    }

    return action(formData, ...args);
  };
}
