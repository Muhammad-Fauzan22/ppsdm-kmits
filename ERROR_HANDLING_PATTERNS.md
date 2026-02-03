# Error Handling Patterns for PPSDM KMITS

## Overview

This document outlines the standardized error handling patterns used throughout the PPSDM KMITS application. All error handling is centralized in `src/lib/error-handling.ts`.

---

## 1. Standardized Error Response Format

All API errors return a consistent JSON format:

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  type?: ErrorType;
  code?: string;
  details?: unknown;
}
```

### Example Responses

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed: email is required",
  "type": "VALIDATION_ERROR",
  "code": "VALIDATION_ERROR"
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": "Authentication required",
  "type": "AUTHENTICATION_ERROR",
  "code": "AUTHENTICATION_ERROR"
}
```

---

## 2. Error Types

```typescript
enum ErrorType {
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
```

---

## 3. Error Severity Levels

```typescript
enum ErrorSeverity {
  LOW = 'low',       // Expected errors
  MEDIUM = 'medium', // Operational errors
  HIGH = 'high',     // System errors
  CRITICAL = 'critical', // System failures
}
```

---

## 4. Custom Error Class

```typescript
class PPSDMError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN_ERROR,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode: number = 500,
    isOperational: boolean = true,
    metadata?: Record<string, unknown>
  );
}
```

---

## 5. Error Factory Functions

```typescript
const errorFactory = {
  validation: (message: string, metadata?: Record<string, unknown>) =>
    new PPSDMError(message, ErrorType.VALIDATION_ERROR, ErrorSeverity.LOW, 400, true, metadata),

  authentication: (message = 'Authentication required', metadata?: Record<string, unknown>) =>
    new PPSDMError(message, ErrorType.AUTHENTICATION_ERROR, ErrorSeverity.MEDIUM, 401, true, metadata),

  authorization: (message = 'Insufficient permissions', metadata?: Record<string, unknown>) =>
    new PPSDMError(message, ErrorType.AUTHORIZATION_ERROR, ErrorSeverity.HIGH, 403, true, metadata),

  database: (message: string, metadata?: Record<string, unknown>) =>
    new PPSDMError(message, ErrorType.DATABASE_ERROR, ErrorSeverity.HIGH, 500, false, metadata),

  network: (message: string, metadata?: Record<string, unknown>) =>
    new PPSDMError(message, ErrorType.NETWORK_ERROR, ErrorSeverity.MEDIUM, 502, false, metadata),

  externalApi: (message: string, metadata?: Record<string, unknown>) =>
    new PPSDMError(message, ErrorType.EXTERNAL_API_ERROR, ErrorSeverity.MEDIUM, 502, true, metadata),

  rateLimit: (message = 'Too many requests', metadata?: Record<string, unknown>) =>
    new PPSDMError(message, ErrorType.RATE_LIMIT_ERROR, ErrorSeverity.LOW, 429, true, metadata),
};
```

---

## 6. Error Boundary Implementation

### Async Error Boundary

```typescript
import { withErrorHandling } from '@/lib/error-handling';

async function fetchUserData(userId: string): Promise<UserData> {
  return withErrorHandling(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw errorFactory.notFound(`User ${userId} not found`);
      }
      return response.json();
    },
    { userId, url: '/api/users', method: 'GET' }
  );
}
```

### API Route Error Handler

```typescript
import { handleApiError } from '@/lib/error-handling';

export async function GET(request: NextRequest) {
  try {
    // Your logic here
  } catch (error) {
    return handleApiError(error as Error, request);
  }
}
```

---

## 7. Global Error Handler Setup

```typescript
import { setupGracefulShutdown } from '@/lib/error-handling';

setupGracefulShutdown(async () => {
  await closeDatabaseConnections();
  await flushLogs();
});
```

---

## 8. Database Error Handling

Handle PostgreSQL error codes:

```typescript
import { handleDatabaseError } from '@/lib/error-handling';

try {
  await supabase.from('users').insert(data);
} catch (error) {
  throw handleDatabaseError(error);
}
```

### Common PostgreSQL Error Codes

| Code | Error Type | Message |
|------|-----------|---------|
| 23505 | unique_violation | A record already exists |
| 23503 | foreign_key_violation | Referenced record not found |
| 23502 | not_null_violation | Required field missing |
| 42501 | insufficient_privilege | Database access denied |

---

## 9. Retry Mechanism

```typescript
import { withRetry } from '@/lib/error-handling';

const result = await withRetry(
  async () => fetchExternalData(),
  {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
    retryableErrors: [ErrorType.NETWORK_ERROR, ErrorType.EXTERNAL_API_ERROR],
  }
);
```

---

## 10. Best Practices

### DO

1. Use factory functions for consistent errors
2. Include metadata for debugging context
3. Set appropriate severity levels
4. Handle or log all errors
5. Use error boundaries for async operations

### DON'T

1. Don't throw raw errors
2. Don't expose sensitive data in responses
3. Don't ignore errors
4. Don't use generic messages
5. Don't retry non-retryable errors

---

## Summary

This error handling system ensures:
- **Consistency** - All errors follow the same format
- **Traceability** - Full context for debugging
- **Security** - No sensitive data in responses
- **Observability** - Proper logging and monitoring
- **Resilience** - Retry mechanisms and graceful degradation 
