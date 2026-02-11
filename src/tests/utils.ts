import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ReactNode } from 'react';

/**
 * Test Utilities for PPSDM KMITS
 * 
 * This file contains shared test utilities, mocks, and helpers
 * for consistent testing across the application.
 */

// ============================================================================
// MOCK UTILITIES
// ============================================================================

/**
 * Create a mock Supabase user
 */
export function createMockUser(overrides?: Partial<AuthUser>) {
  return {
    id: 'test-user-id',
    email: 'test@student.its.ac.id',
    role: 'student',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock Supabase session
 */
export function createMockSession(overrides?: Partial<AuthSession>) {
  const user = createMockUser(overrides?.user);
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user,
    ...overrides,
  };
}

/**
 * Mock Supabase client factory
 */
export function createMockSupabaseClient(options: {
  user?: AuthUser | null;
  error?: Error | null;
} = {}) {
  const { user = createMockUser(), error = null } = options;

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error }),
      getSession: vi.fn().mockResolvedValue({ 
        data: { session: user ? createMockSession({ user }) : null }, 
        error 
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: vi.fn() } } 
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
}

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

/**
 * Create mock assessment data
 */
export function createMockAssessment(overrides?: Partial<Assessment>) {
  return {
    id: 'test-assessment-id',
    user_id: 'test-user-id',
    status: 'completed',
    overall_score: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create mock assessment result
 */
export function createMockAssessmentResult(overrides?: Partial<AssessmentResult>) {
  return {
    id: 'test-result-id',
    assessment_id: 'test-assessment-id',
    dimension_id: 'cognitive',
    raw_score: 80,
    normalized_score: 80,
    percentile_rank: 75,
    ...overrides,
  };
}

/**
 * Create mock user profile
 */
export function createMockProfile(overrides?: Partial<Profile>) {
  return {
    id: 'test-user-id',
    full_name: 'Test Student',
    email: 'test@student.its.ac.id',
    nim: '1234567890',
    department: 'Teknik Informatika',
    role: 'student',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

// ============================================================================
// API TEST HELPERS
// ============================================================================

/**
 * Create a mock NextRequest
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: object;
  headers?: Record<string, string>;
} = {}) {
  const { 
    method = 'GET', 
    url = 'http://localhost:3000/api/test',
    body,
    headers = {} 
  } = options;

  const request = new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return request as NextRequest;
}

/**
 * Parse JSON response from API route
 */
export async function parseJSON(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ============================================================================
// COMPONENT TEST HELPERS
// ============================================================================

/**
 * Mock router for Next.js navigation testing
 */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

/**
 * Mock window.matchMedia for responsive testing
 */
export function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Mock IntersectionObserver for lazy loading tests
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
}

// ============================================================================
// ASSERTION HELPERS
// ============================================================================

/**
 * Assert that response is successful
 */
export function expectSuccess(response: Response) {
  expect(response.status).toBe(200);
}

/**
 * Assert that response is error
 */
export function expectError(response: Response, expectedStatus: number = 400) {
  expect(response.status).toBe(expectedStatus);
}

/**
 * Assert that JSON response has expected structure
 */
export function expectJSONStructure(
  data: any, 
  requiredFields: string[]
) {
  requiredFields.forEach(field => {
    expect(data).toHaveProperty(field);
  });
}

// ============================================================================
// SETUP & TEARDOWN
// ============================================================================

/**
 * Standard test setup
 */
export function setupTest() {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AuthUser {
  id: string;
  email: string;
  role: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
}

interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

interface Assessment {
  id: string;
  user_id: string;
  status: string;
  overall_score: number;
  created_at: string;
  updated_at: string;
}

interface AssessmentResult {
  id: string;
  assessment_id: string;
  dimension_id: string;
  raw_score: number;
  normalized_score: number;
  percentile_rank: number;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  nim?: string;
  department?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// NextRequest type augmentation
import type { NextRequest as OriginalNextRequest } from 'next/server';
type NextRequest = OriginalNextRequest;

// Re-export vitest functions for convenience
export { describe, it, expect, vi, beforeEach, afterEach };
