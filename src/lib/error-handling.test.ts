import { describe, it, expect } from 'vitest';
import {
  ErrorSeverity,
  ErrorType,
  PPSDMError,
  errorFactory,
  formatErrorResponse,
} from './error-handling';

describe('error-handling', () => {
  it('errorFactory.validation creates a PPSDMError with expected fields', () => {
    const err = errorFactory.validation('Bad input', { field: 'email' });

    expect(err).toBeInstanceOf(PPSDMError);
    expect(err.type).toBe(ErrorType.VALIDATION_ERROR);
    expect(err.severity).toBe(ErrorSeverity.LOW);
    expect(err.statusCode).toBe(400);
    expect(err.isOperational).toBe(true);
    expect(err.metadata?.field).toBe('email');
  });

  it('formatErrorResponse formats PPSDMError', () => {
    const err = errorFactory.authorization('Forbidden', { reason: 'role' });
    const res = formatErrorResponse(err);

    expect(res.success).toBe(false);
    expect(res.error).toBe('Forbidden');
    expect(res.type).toBe(ErrorType.AUTHORIZATION_ERROR);
    expect(res.code).toBe(ErrorType.AUTHORIZATION_ERROR);
    // details are only returned in development; test env should not rely on mutating process.env
    expect(res.details).toBeUndefined();
  });

  it('formatErrorResponse formats generic Error', () => {
    const res = formatErrorResponse(new Error('Boom'));

    expect(res.success).toBe(false);
    expect(res.error).toBe('Boom');
    expect(res.type).toBe(ErrorType.UNKNOWN_ERROR);
    expect(res.code).toBe('INTERNAL_ERROR');
  });
});
