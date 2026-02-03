/**
 * API Error Handler
 * 
 * Menangani error pada API routes dengan format response yang konsisten
 * Mendukung logging ke console dan error tracking service
 */

import { NextResponse } from 'next/server';

/**
 * Tipe error yang dikenali
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL = 'EXTERNAL_ERROR',
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response format
 */
interface ErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    statusCode: number;
    details?: Record<string, any>;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Generate error response
 */
export function errorResponse(
  error: ApiError | Error,
  requestId?: string
): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();

  // Jika error adalah ApiError
  if (error instanceof ApiError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        type: error.type,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
        timestamp,
        requestId,
      },
    };

    // Log error
    logError(error, requestId);

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Untuk error generik
  const response: ErrorResponse = {
    success: false,
    error: {
      type: ErrorType.INTERNAL,
      message: process.env.NODE_ENV === 'production'
        ? 'Terjadi kesalahan internal server'
        : error.message,
      statusCode: 500,
      timestamp,
      requestId,
    },
  };

  // Log error
  logError(error, requestId);

  return NextResponse.json(response, { status: 500 });
}

/**
 * Log error ke console dan error tracking service
 */
function logError(error: Error, requestId?: string): void {
  const logData = {
    timestamp: new Date().toISOString(),
    requestId,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  };

  // Log ke console
  console.error('[API Error]', JSON.stringify(logData, null, 2));

  // Log ke error tracking service (jika tersedia)
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      tags: {
        requestId,
        errorType: error.name,
      },
      extra: logData,
    });
  }
}

/**
 * Helper functions untuk membuat error yang umum
 */
export const ErrorHelpers = {
  validation: (message: string, details?: Record<string, any>) =>
    new ApiError(ErrorType.VALIDATION, message, 400, details),

  authentication: (message: string = 'Autentikasi diperlukan') =>
    new ApiError(ErrorType.AUTHENTICATION, message, 401),

  authorization: (message: string = 'Anda tidak memiliki akses') =>
    new ApiError(ErrorType.AUTHORIZATION, message, 403),

  notFound: (resource: string = 'Resource') =>
    new ApiError(ErrorType.NOT_FOUND, `${resource} tidak ditemukan`, 404),

  conflict: (message: string) =>
    new ApiError(ErrorType.CONFLICT, message, 409),

  rateLimit: (message: string = 'Terlalu banyak permintaan') =>
    new ApiError(ErrorType.RATE_LIMIT, message, 429),

  database: (message: string = 'Database error') =>
    new ApiError(ErrorType.DATABASE, message, 500),

  external: (service: string, message: string) =>
    new ApiError(ErrorType.EXTERNAL, `Error dari ${service}: ${message}`, 502),

  internal: (message: string = 'Internal server error') =>
    new ApiError(ErrorType.INTERNAL, message, 500),
};

/**
 * Wrapper untuk API route handlers
 * Menangani error secara otomatis dan mengembalikan response yang konsisten
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Generate request ID
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Handle error
      if (error instanceof ApiError) {
        return errorResponse(error, requestId);
      }

      // Handle error generik
      return errorResponse(error as Error, requestId);
    }
  };
}

/**
 * Validate request body dengan Zod schema
 */
export async function validateRequest<T>(
  schema: any,
  body: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(body);
  } catch (error: any) {
    throw ErrorHelpers.validation(
      'Validasi gagal',
      error.errors || { message: error.message }
    );
  }
}
