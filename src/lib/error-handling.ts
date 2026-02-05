import { NextRequest, NextResponse } from 'next/server';
import { logger, apiLogger } from '@/lib/logger';

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  CSRF_ERROR = 'CSRF_ERROR',
  XSS_ERROR = 'XSS_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Custom error class
export class PPSDMError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode: number = 500,
    isOperational: boolean = true,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'PPSDMError';
    this.type = type;
    this.severity = severity;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.metadata = metadata;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error factory functions
export const errorFactory = {
  validation: (message: string, metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.VALIDATION_ERROR, ErrorSeverity.LOW, 400, true, metadata),

  authentication: (message: string = 'Authentication required', metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.AUTHENTICATION_ERROR, ErrorSeverity.MEDIUM, 401, true, metadata),

  authorization: (message: string = 'Insufficient permissions', metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.AUTHORIZATION_ERROR, ErrorSeverity.HIGH, 403, true, metadata),

  database: (message: string, metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.DATABASE_ERROR, ErrorSeverity.HIGH, 500, false, metadata),

  network: (message: string, metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.NETWORK_ERROR, ErrorSeverity.MEDIUM, 502, false, metadata),

  externalApi: (message: string, metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.EXTERNAL_API_ERROR, ErrorSeverity.MEDIUM, 502, true, metadata),

  rateLimit: (message: string = 'Too many requests', metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.RATE_LIMIT_ERROR, ErrorSeverity.LOW, 429, true, metadata),

  csrf: (message: string = 'CSRF validation failed', metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.CSRF_ERROR, ErrorSeverity.MEDIUM, 403, true, metadata),

  xss: (message: string = 'XSS attempt detected', metadata?: Record<string, any>) =>
    new PPSDMError(message, ErrorType.XSS_ERROR, ErrorSeverity.HIGH, 400, true, metadata),
};

// Error response formatter
export function formatErrorResponse(error: Error | PPSDMError): {
  success: false;
  error: string;
  type?: ErrorType;
  code?: string;
  details?: any;
} {
  if (error instanceof PPSDMError) {
    return {
      success: false,
      error: error.message,
      type: error.type,
      code: error.type,
      details: process.env.NODE_ENV === 'development' ? error.metadata : undefined,
    };
  }

  // Handle generic errors
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    type: ErrorType.UNKNOWN_ERROR,
    code: 'INTERNAL_ERROR',
  };
}

// Error logging function
export function logError(error: Error | PPSDMError, context?: {
  userId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  requestId?: string;
}) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    type: error instanceof PPSDMError ? error.type : ErrorType.UNKNOWN_ERROR,
    severity: error instanceof PPSDMError ? error.severity : ErrorSeverity.MEDIUM,
    isOperational: error instanceof PPSDMError ? error.isOperational : false,
    metadata: error instanceof PPSDMError ? error.metadata : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  // Log based on severity
  if (error instanceof PPSDMError) {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        logger.error('CRITICAL_ERROR', errorInfo);
        break;
      case ErrorSeverity.HIGH:
        logger.error('HIGH_PRIORITY_ERROR', errorInfo);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn('MEDIUM_PRIORITY_ERROR', errorInfo);
        break;
      case ErrorSeverity.LOW:
        logger.info('LOW_PRIORITY_ERROR', errorInfo);
        break;
    }
  } else {
    logger.error('UNHANDLED_ERROR', errorInfo);
  }

  // Log to API logger if context is available
  if (context?.method && context?.url) {
    apiLogger.error({
      method: context.method,
      url: context.url,
      ip: context.ip || 'unknown',
      error: error.message,
      stack: error.stack,
      userId: context.userId,
    });
  }
}

// Error boundary for async operations
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    url?: string;
    method?: string;
    requestId?: string;
  }
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logError(error as Error, context);

    // Re-throw operational errors
    if (error instanceof PPSDMError && error.isOperational) {
      throw error;
    }

    // Convert unknown errors to operational errors
    throw new PPSDMError(
      'An unexpected error occurred. Please try again later.',
      ErrorType.UNKNOWN_ERROR,
      ErrorSeverity.MEDIUM,
      500,
      true,
      { originalError: error instanceof Error ? error.message : String(error) }
    );
  }
}

// API route error handler
export function handleApiError(
  error: Error | PPSDMError,
  request: NextRequest
): NextResponse {
  const context = {
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    method: request.method,
    url: request.url,
  };

  logError(error, context);

  if (error instanceof PPSDMError) {
    return NextResponse.json(
      formatErrorResponse(error),
      { status: error.statusCode }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    formatErrorResponse(error),
    { status: 500 }
  );
}

// Database error handler
export function handleDatabaseError(error: any): PPSDMError {
  // Handle specific PostgreSQL error codes
  const pgErrorCode = error?.code;

  switch (pgErrorCode) {
    case '23505': // unique_violation
      return errorFactory.validation('A record with this information already exists');

    case '23503': // foreign_key_violation
      return errorFactory.validation('Referenced record does not exist');

    case '23502': // not_null_violation
      return errorFactory.validation('Required field is missing');

    case '42501': // insufficient_privilege
      return errorFactory.authorization('Database access denied');

    case 'PGRST116': // No rows returned
      return errorFactory.validation('Record not found', { code: pgErrorCode });

    default:
      return errorFactory.database('Database operation failed', {
        code: pgErrorCode,
        detail: error?.detail,
        hint: error?.hint,
      });
  }
}

// External API error handler
export function handleExternalApiError(error: any, service: string): PPSDMError {
  const statusCode = error?.response?.status || error?.status || 500;
  const message = error?.response?.data?.message || error?.message || 'External API error';

  return errorFactory.externalApi(
    `${service} API error: ${message}`,
    {
      service,
      statusCode,
      originalError: message,
    }
  );
}

// Validation error handler
export function handleValidationError(errors: any[]): PPSDMError {
  const errorMessages = errors.map(err =>
    err.message || `${err.field}: ${err.code}`
  );

  return errorFactory.validation(
    `Validation failed: ${errorMessages.join(', ')}`,
    { validationErrors: errors }
  );
}

// Retry mechanism for transient errors
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    backoffMultiplier?: number;
    retryableErrors?: ErrorType[];
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    retryableErrors = [ErrorType.NETWORK_ERROR, ErrorType.EXTERNAL_API_ERROR],
  } = options;

  let lastError: Error;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry if it's not a retryable error or it's the last attempt
      if (
        !(error instanceof PPSDMError) ||
        !retryableErrors.includes(error.type) ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;

      logger.warn('RETRY_ATTEMPT', {
        attempt,
        maxAttempts,
        delay: currentDelay,
        error: error.message,
      });
    }
  }

  throw lastError!;
}

// Graceful shutdown handler
export function setupGracefulShutdown(callback: () => Promise<void>) {
  const shutdown = async (signal: string) => {
    logger.info('GRACEFUL_SHUTDOWN_INITIATED', { signal });

    try {
      await callback();
      logger.info('GRACEFUL_SHUTDOWN_COMPLETED');
      process.exit(0);
    } catch (error) {
      logger.error('GRACEFUL_SHUTDOWN_ERROR', {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logError(error, { requestId: 'uncaughtException' });
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logError(error, { requestId: 'unhandledRejection' });
    process.exit(1);
  });
}

// Health check function
export async function performHealthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: string;
}> {
  const checks: Record<string, boolean> = {};

  try {
    // Database health check
    checks.database = true; // Implement actual DB check

    // External API health checks
    checks.supabase = true; // Implement actual Supabase check

    // File system health check
    checks.fileSystem = true; // Implement actual FS check

  } catch (error) {
    checks.error = false;
    logError(error as Error, { requestId: 'healthCheck' });
  }

  const allHealthy = Object.values(checks).every(check => check);

  return {
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  };
}

// Export types
export type { NextRequest, NextResponse };
