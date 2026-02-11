/**
 * Input Validation Decorators and Utilities
 * Provides declarative validation for API routes
 */

import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { ValidationError } from './error-handler';

// Validation schemas for common types
export const schemas = {
  uuid: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  url: z.string().url(),
  phone: z.string().regex(/^\+?[\d\s-()]+$/),
  
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10)
  }),
  
  dateRange: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  }).refine(data => data.startDate <= data.endDate, {
    message: "Start date must be before or equal to end date"
  })
};

// Validation middleware for API routes
export function validateBody<T extends z.ZodType>(schema: T) {
  return async (req: NextRequest): Promise<z.infer<T>> => {
    try {
      const body = await req.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          'Validation failed: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        );
      }
      throw new ValidationError('Invalid request body');
    }
  };
}

export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: NextRequest): z.infer<T> => {
    try {
      const url = new URL(req.url);
      const query: Record<string, any> = {};
      
      url.searchParams.forEach((value, key) => {
        // Try to parse as number or boolean
        if (value === 'true') query[key] = true;
        else if (value === 'false') query[key] = false;
        else if (!isNaN(Number(value))) query[key] = Number(value);
        else query[key] = value;
      });
      
      return schema.parse(query);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          'Query validation failed: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        );
      }
      throw new ValidationError('Invalid query parameters');
    }
  };
}

export function validateParams<T extends z.ZodType>(schema: T) {
  return (params: Record<string, string>): z.infer<T> => {
    try {
      return schema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          'Parameter validation failed: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        );
      }
      throw new ValidationError('Invalid path parameters');
    }
  };
}

// Higher-order function for complete request validation
export function withValidation<
  BodySchema extends z.ZodType | undefined,
  QuerySchema extends z.ZodType | undefined,
  ParamsSchema extends z.ZodType | undefined
>(options: {
  body?: BodySchema;
  query?: QuerySchema;
  params?: ParamsSchema;
}) {
  return function handler(
    fn: (
      req: NextRequest,
      validated: {
        body: BodySchema extends z.ZodType ? z.infer<BodySchema> : undefined;
        query: QuerySchema extends z.ZodType ? z.infer<QuerySchema> : undefined;
        params: ParamsSchema extends z.ZodType ? z.infer<ParamsSchema> : undefined;
      }
    ) => Promise<NextResponse>
  ) {
    return async (
      req: NextRequest,
      routeParams?: Record<string, string>
    ): Promise<NextResponse> => {
      const validated: any = {
        body: undefined,
        query: undefined,
        params: undefined
      };

      // Validate body
      if (options.body) {
        validated.body = await validateBody(options.body)(req);
      }

      // Validate query
      if (options.query) {
        validated.query = validateQuery(options.query)(req);
      }

      // Validate params
      if (options.params && routeParams) {
        validated.params = validateParams(options.params)(routeParams);
      }

      return fn(req, validated);
    };
  };
}

// Common validation schemas for reuse
export const CommonSchemas = {
  // User schemas
  createUser: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(2),
    role: z.enum(['student', 'lecturer', 'admin']).optional()
  }),

  updateUser: z.object({
    fullName: z.string().min(2).optional(),
    bio: z.string().max(500).optional(),
    phoneNumber: z.string().optional(),
    avatarUrl: z.string().url().optional()
  }),

  // Assessment schemas
  createAssessment: z.object({
    dimensionId: z.number().int().positive()
  }),

  completeAssessment: z.object({
    assessmentId: z.string().uuid(),
    answers: z.array(z.object({
      questionId: z.string().uuid(),
      answer: z.union([z.string(), z.number(), z.array(z.string())])
    }))
  }),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  }),

  // Search
  search: z.object({
    q: z.string().min(1),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20)
  }),

  // ID parameter
  idParam: z.object({
    id: z.string().uuid()
  })
};

// Sanitization helpers
export function sanitizeString(input: string, maxLength: number = 255): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Basic XSS prevention
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Type guards
export function isValidUUID(value: string): boolean {
  return schemas.uuid.safeParse(value).success;
}

export function isValidEmail(value: string): boolean {
  return schemas.email.safeParse(value).success;
}

// Validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export function safeValidate<T>(schema: z.ZodType<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
    };
  }
}
