/**
 * Global Error Handler
 * Centralized error handling for the application
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeHtml } from '@/lib/sanitize';

// Custom error classes
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super('Too many requests', 429, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

// Error response interface
interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

// Generate request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Global error handler
export function handleError(error: Error, requestId: string): NextResponse {
  // Default error response
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details: any = undefined;

  // Handle specific error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
  } else if (error instanceof z.ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
  } else if (error.name === 'SyntaxError' && 'body' in error) {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Invalid JSON in request body';
  }

  // Sanitize error message for production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An unexpected error occurred';
    details = undefined;
  }

  const errorResponse: ErrorResponse = {
    error: {
      message: sanitizeHtml(message),
      code,
      statusCode,
      details,
      timestamp: new Date().toISOString(),
      requestId
    }
  };

  const response = NextResponse.json(errorResponse, { status: statusCode });
  
  // Add rate limit headers if applicable
  if (error instanceof RateLimitError) {
    response.headers.set('Retry-After', '60');
  }

  return response;
}

// Middleware wrapper for error handling
export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const requestId = generateRequestId();
    
    // Add request ID to headers for tracking
    req.headers.set('x-request-id', requestId);

    try {
      return await handler(req);
    } catch (error) {
      return handleError(error as Error, requestId);
    }
  };
}

// API Route wrapper with error handling
export function createAPIHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return withErrorHandler(handler);
}

// Helper to log errors with context
export function logError(
  error: Error,
  context: {
    requestId: string;
    userId?: string;
    path?: string;
    method?: string;
    metadata?: Record<string, any>;
  }
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    requestId: context.requestId,
    userId: context.userId,
    path: context.path,
    method: context.method,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    metadata: context.metadata
  };

  // Log to console (in production, send to logging service)
  console.error('Error logged:', logEntry);

  // In production, you might want to send to:
  // - Sentry
  // - LogRocket
  // - DataDog
  // - Splunk
}
