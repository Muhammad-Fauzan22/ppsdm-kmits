import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock implementations for testing
export const mockDatabase = {
  // Mock database operations
  users: {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  assessments: {
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  courses: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    enroll: jest.fn(),
  },
};

// Mock API responses
export const mockApiResponses = {
  success: (data: any, status = 200) => ({
    ok: true,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  }),

  error: (message: string, status = 400) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
    text: () => Promise.resolve(JSON.stringify({ error: message })),
  }),

  networkError: () => {
    throw new Error('Network error');
  },
};

// Test data generators
export const testDataGenerators = {
  user: (overrides = {}) => ({
    id: 'user-123',
    email: 'test@student.its.ac.id',
    name: 'Test User',
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  assessment: (overrides = {}) => ({
    id: 'assessment-123',
    userId: 'user-123',
    type: 'holistic',
    dimensions: {
      physical: 75,
      mental: 80,
      emotional: 70,
      spiritual: 85,
      character: 78,
      cognitive: 82,
      financial: 65,
      environmental: 88,
      selfManagement: 76,
    },
    scores: [75, 80, 70, 85, 78, 82, 65, 88, 76],
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  course: (overrides = {}) => ({
    id: 'course-123',
    title: 'Test Course',
    description: 'A test course for development',
    instructor: 'Test Instructor',
    duration: 40,
    level: 'intermediate',
    modules: [
      {
        id: 'module-1',
        title: 'Introduction',
        duration: 10,
        content: 'Course introduction content',
      },
    ],
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  apiRequest: (overrides = {}) => ({
    method: 'GET',
    url: '/api/test',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'test-agent',
    },
    ip: '127.0.0.1',
    ...overrides,
  }),
};

// Component testing utilities
export const componentTestUtils = {
  // Custom render function with providers
  renderWithProviders: (
    ui: ReactElement,
    options: Omit<RenderOptions, 'wrapper'> = {}
  ) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );

    return render(ui, { wrapper: Wrapper, ...options });
  },

  // Mock router
  mockRouter: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  },

  // Mock auth context
  mockAuthContext: {
    user: testDataGenerators.user(),
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
    session: {
      user: testDataGenerators.user(),
      expires: new Date(Date.now() + 3600000).toISOString(),
    },
  },
};

// Accessibility testing utilities
export const accessibilityTestUtils = {
  // Check if images have alt text
  hasAltText: (img: HTMLElement) => {
    return img.hasAttribute('alt') && img.getAttribute('alt')!.trim() !== '';
  },

  // Check if form inputs have labels
  hasLabel: (input: HTMLElement) => {
    const id = input.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      return !!label;
    }
    return input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
  },

  // Check if buttons have accessible names
  hasAccessibleName: (button: HTMLElement) => {
    return (
      button.textContent?.trim() ||
      button.getAttribute('aria-label') ||
      button.getAttribute('aria-labelledby') ||
      button.hasAttribute('title')
    );
  },

  // Check color contrast (simplified)
  hasGoodContrast: (element: HTMLElement) => {
    // This would need a proper color contrast library
    // For now, return true as placeholder
    return true;
  },

  // Run comprehensive accessibility checks
  runAccessibilityChecks: (container: HTMLElement) => {
    const issues: string[] = [];

    // Check images
    const images = container.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!accessibilityTestUtils.hasAltText(img)) {
        issues.push(`Image ${index + 1} missing alt text`);
      }
    });

    // Check form inputs
    const inputs = container.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      if (!accessibilityTestUtils.hasLabel(input)) {
        issues.push(`Input ${index + 1} missing label`);
      }
    });

    // Check buttons
    const buttons = container.querySelectorAll('button');
    buttons.forEach((button, index) => {
      if (!accessibilityTestUtils.hasAccessibleName(button)) {
        issues.push(`Button ${index + 1} missing accessible name`);
      }
    });

    return {
      passed: issues.length === 0,
      issues,
      totalChecks: images.length + inputs.length + buttons.length,
    };
  },
};

// Performance testing utilities
export const performanceTestUtils = {
  // Measure component render time
  measureRenderTime: async (component: React.ComponentType, props = {}) => {
    const startTime = performance.now();

    // Render component
    const { render: renderFn } = await import('@testing-library/react');
    const { container } = renderFn(componentTestUtils.renderWithProviders(component(props)));

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    return {
      renderTime,
      isFast: renderTime < 100, // Less than 100ms
      container,
    };
  },

  // Mock performance API
  mockPerformanceAPI: () => {
    Object.defineProperty(window, 'performance', {
      value: {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByName: jest.fn(() => []),
        getEntriesByType: jest.fn(() => []),
      },
      writable: true,
    });
  },

  // Bundle size assertions
  assertBundleSize: (size: number, maxSize: number) => {
    const sizeInMB = size / (1024 * 1024);
    const maxSizeInMB = maxSize / (1024 * 1024);

    if (size > maxSize) {
      throw new Error(
        `Bundle size ${sizeInMB.toFixed(2)}MB exceeds limit of ${maxSizeInMB.toFixed(2)}MB`
      );
    }

    return {
      size: sizeInMB,
      maxSize: maxSizeInMB,
      passed: size <= maxSize,
    };
  },
};

// Security testing utilities
export const securityTestUtils = {
  // Test XSS prevention
  testXSSPrevention: (input: string, expectedOutput?: string) => {
    // This would integrate with your XSS sanitization function
    // For now, return a basic check
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
    ];

    const hasDangerousContent = dangerousPatterns.some(pattern => pattern.test(input));

    return {
      isSafe: !hasDangerousContent,
      detectedPatterns: dangerousPatterns.filter(pattern => pattern.test(input)),
    };
  },

  // Test CSRF protection
  testCSRFProtection: (request: any) => {
    // Check if request has CSRF token
    const hasToken = request.headers?.['x-csrf-token'] || request.body?.csrfToken;

    return {
      hasToken: !!hasToken,
      tokenValid: hasToken && hasToken.length === 64, // Assuming 32-byte hex token
    };
  },

  // Test rate limiting
  testRateLimiting: (requests: any[], limit: number, window: number) => {
    const now = Date.now();
    const windowStart = now - window;

    const requestsInWindow = requests.filter(req => req.timestamp >= windowStart);

    return {
      withinLimit: requestsInWindow.length <= limit,
      currentCount: requestsInWindow.length,
      limit,
      windowMs: window,
    };
  },
};

// API testing utilities
export const apiTestUtils = {
  // Mock Next.js request
  createMockRequest: (overrides = {}) => ({
    method: 'GET',
    url: 'http://localhost:3000/api/test',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'test-agent',
    },
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue(''),
    formData: jest.fn().mockResolvedValue(new FormData()),
    ...overrides,
  }),

  // Mock Next.js response
  createMockResponse: () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  }),

  // Test API error handling
  testApiErrorHandling: async (apiCall: () => Promise<any>) => {
    try {
      await apiCall();
      return { success: true, error: null };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status || 500,
          type: error.type || 'unknown',
        },
      };
    }
  },
};

// Database testing utilities
export const databaseTestUtils = {
  // Mock Supabase client
  createMockSupabaseClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      like: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  }),

  // Test database error handling
  testDatabaseErrorHandling: async (dbCall: () => Promise<any>) => {
    try {
      const result = await dbCall();
      return { success: true, data: result, error: null };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      };
    }
  },
};

// Integration testing utilities
export const integrationTestUtils = {
  // Setup test database
  setupTestDatabase: async () => {
    // This would set up a test database instance
    // For now, return a mock setup
    return {
      connectionString: 'postgresql://test:test@localhost:5432/testdb',
      cleanup: jest.fn(),
    };
  },

  // Setup test server
  setupTestServer: async () => {
    // This would start a test server instance
    // For now, return mock server info
    return {
      url: 'http://localhost:3001',
      close: jest.fn(),
    };
  },

  // End-to-end test helpers
  e2eHelpers: {
    // Login helper
    login: async (page: any, email: string, password: string) => {
      await page.fill('[data-testid="email-input"]', email);
      await page.fill('[data-testid="password-input"]', password);
      await page.click('[data-testid="login-button"]');
      await page.waitForURL('**/dashboard');
    },

    // Navigation helper
    navigateTo: async (page: any, path: string) => {
      await page.goto(`http://localhost:3000${path}`);
      await page.waitForLoadState('networkidle');
    },

    // Form submission helper
    submitForm: async (page: any, formData: Record<string, string>) => {
      for (const [field, value] of Object.entries(formData)) {
        await page.fill(`[data-testid="${field}"]`, value);
      }
      await page.click('[data-testid="submit-button"]');
    },
  },
};

// Export all utilities
export {
  mockDatabase,
  mockApiResponses,
  testDataGenerators,
  componentTestUtils,
  accessibilityTestUtils,
  performanceTestUtils,
  securityTestUtils,
  apiTestUtils,
  databaseTestUtils,
  integrationTestUtils,
};
