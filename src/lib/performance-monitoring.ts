import { NextRequest, NextResponse } from 'next/server';

// Performance monitoring configuration
const PERFORMANCE_CONFIG = {
  // Slow query threshold (ms)
  slowQueryThreshold: 1000,

  // Memory usage threshold (MB)
  memoryThreshold: 100,

  // Response time thresholds (ms)
  responseTimeThresholds: {
    good: 500,
    poor: 2000,
  },

  // Bundle size limits (bytes)
  bundleSizeLimits: {
    main: 200 * 1024, // 200KB
    vendor: 500 * 1024, // 500KB
    total: 1000 * 1024, // 1MB
  },

  // Core Web Vitals targets
  coreWebVitals: {
    lcp: 2500, // ms
    fid: 100, // ms
    cls: 0.1, // score
  },
};

// Performance metrics storage
class PerformanceMetrics {
  private metrics: Map<string, any[]> = new Map();
  private alerts: any[] = [];

  record(metric: string, value: any, context?: any) {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, []);
    }

    this.metrics.get(metric)!.push({
      value,
      timestamp: Date.now(),
      context,
    });

    // Keep only last 1000 entries per metric
    const entries = this.metrics.get(metric)!;
    if (entries.length > 1000) {
      entries.shift();
    }

    // Check for alerts
    this.checkAlerts(metric, value, context);
  }

  getMetrics(metric: string, limit: number = 100) {
    return this.metrics.get(metric)?.slice(-limit) || [];
  }

  getAllMetrics() {
    const result: Record<string, any[]> = {};
    for (const [key, values] of this.metrics.entries()) {
      result[key] = values.slice(-50); // Last 50 entries
    }
    return result;
  }

  private checkAlerts(metric: string, value: any, context?: any) {
    switch (metric) {
      case 'response_time':
        if (value > PERFORMANCE_CONFIG.responseTimeThresholds.poor) {
          this.alerts.push({
            type: 'performance',
            severity: 'high',
            message: `Slow response time: ${value}ms`,
            metric,
            value,
            context,
            timestamp: Date.now(),
          });
        }
        break;

      case 'memory_usage':
        if (value > PERFORMANCE_CONFIG.memoryThreshold) {
          this.alerts.push({
            type: 'performance',
            severity: 'medium',
            message: `High memory usage: ${value}MB`,
            metric,
            value,
            context,
            timestamp: Date.now(),
          });
        }
        break;

      case 'error_rate':
        if (value > 5) { // 5% error rate
          this.alerts.push({
            type: 'performance',
            severity: 'high',
            message: `High error rate: ${value}%`,
            metric,
            value,
            context,
            timestamp: Date.now(),
          });
        }
        break;
    }
  }

  getAlerts(limit: number = 50) {
    return this.alerts.slice(-limit);
  }

  clearAlerts() {
    this.alerts = [];
  }
}

// Global performance metrics instance
const performanceMetrics = new PerformanceMetrics();

// Performance monitoring utilities
export const performanceUtils = {
  // Measure execution time
  measureExecutionTime: async <T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: any
  ): Promise<T> => {
    const startTime = Date.now();
    try {
      const result = await operation();
      const executionTime = Date.now() - startTime;

      performanceMetrics.record('execution_time', executionTime, {
        operation: operationName,
        ...context,
      });

      // Log slow operations
      if (executionTime > PERFORMANCE_CONFIG.slowQueryThreshold) {
        console.warn(`Slow operation: ${operationName} took ${executionTime}ms`, context);
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      performanceMetrics.record('execution_time', executionTime, {
        operation: operationName,
        error: true,
        ...context,
      });
      throw error;
    }
  },

  // Track API response times
  trackApiResponse: (method: string, url: string, responseTime: number, statusCode: number) => {
    performanceMetrics.record('api_response_time', responseTime, {
      method,
      url,
      statusCode,
    });

    // Log slow API responses
    if (responseTime > PERFORMANCE_CONFIG.responseTimeThresholds.good) {
      console.warn(`Slow API response: ${method} ${url} took ${responseTime}ms`);
    }
  },

  // Monitor memory usage
  trackMemoryUsage: () => {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);

      performanceMetrics.record('memory_usage', usedMB);

      return usedMB;
    }
    return null;
  },

  // Track bundle size
  trackBundleSize: (bundleName: string, size: number) => {
    performanceMetrics.record('bundle_size', size, { bundleName });

    const limit = PERFORMANCE_CONFIG.bundleSizeLimits[bundleName as keyof typeof PERFORMANCE_CONFIG.bundleSizeLimits] ||
                  PERFORMANCE_CONFIG.bundleSizeLimits.total;

    if (size > limit) {
      console.warn(`Large bundle: ${bundleName} is ${(size / 1024).toFixed(1)}KB (limit: ${(limit / 1024).toFixed(1)}KB)`);
    }
  },

  // Track Core Web Vitals
  trackWebVitals: (metric: any) => {
    const { name, value } = metric;

    performanceMetrics.record(`web_vitals_${name.toLowerCase()}`, value);

    // Check against targets
    const target = PERFORMANCE_CONFIG.coreWebVitals[name.toLowerCase() as keyof typeof PERFORMANCE_CONFIG.coreWebVitals];
    if (target && value > target) {
      console.warn(`Poor Core Web Vital: ${name} = ${value} (target: ${target})`);
    }
  },

  // Track user interactions
  trackUserInteraction: (interaction: string, duration: number, context?: any) => {
    performanceMetrics.record('user_interaction', duration, {
      interaction,
      ...context,
    });
  },

  // Get performance report
  getPerformanceReport: () => {
    const metrics = performanceMetrics.getAllMetrics();
    const alerts = performanceMetrics.getAlerts();

    return {
      metrics,
      alerts,
      summary: {
        totalMetrics: Object.keys(metrics).length,
        totalAlerts: alerts.length,
        timestamp: new Date().toISOString(),
      },
    };
  },

  // Clear old metrics
  cleanup: (olderThanMs: number = 24 * 60 * 60 * 1000) => {
    // This would implement cleanup logic for old metrics
    // For now, just clear alerts
    performanceMetrics.clearAlerts();
  },
};

// Database performance monitoring
export const databasePerformance = {
  // Track query performance
  trackQuery: async <T>(
    queryFn: () => Promise<T>,
    queryName: string,
    parameters?: any
  ): Promise<T> => {
    return performanceUtils.measureExecutionTime(
      queryFn,
      `db_query_${queryName}`,
      { parameters }
    );
  },

  // Track connection pool stats
  trackConnectionPool: (stats: {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  }) => {
    performanceMetrics.record('db_connection_pool', stats);
  },
};

// API performance monitoring
export const apiPerformance = {
  // Middleware for API performance tracking
  createPerformanceMiddleware: () => {
    return async (request: NextRequest, response: NextResponse) => {
      const startTime = Date.now();
      const { method, url } = request;

      // Add response interceptor
      const originalJson = response.json.bind(response);
      response.json = async (data: any, options?: any) => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.status;

        performanceUtils.trackApiResponse(method, url, responseTime, statusCode);

        return originalJson(data, options);
      };

      return response;
    };
  },

  // Track external API calls
  trackExternalApi: async <T>(
    apiCall: () => Promise<T>,
    serviceName: string,
    endpoint: string
  ): Promise<T> => {
    return performanceUtils.measureExecutionTime(
      apiCall,
      `external_api_${serviceName}`,
      { endpoint }
    );
  },
};

// Real User Monitoring (RUM)
export const rumMonitoring = {
  // Track page views
  trackPageView: (page: string, loadTime: number) => {
    performanceMetrics.record('page_view', loadTime, { page });
  },

  // Track user journeys
  trackUserJourney: (steps: string[], totalTime: number) => {
    performanceMetrics.record('user_journey', totalTime, { steps });
  },

  // Track errors
  trackError: (error: Error, context?: any) => {
    performanceMetrics.record('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  },

  // Track custom events
  trackEvent: (eventName: string, properties?: any) => {
    performanceMetrics.record('custom_event', properties, { eventName });
  },
};

// Performance budgets
export const performanceBudgets = {
  // Check if performance is within budget
  checkBudget: (metric: string, value: number, budget: number): boolean => {
    const withinBudget = value <= budget;

    if (!withinBudget) {
      console.warn(`Performance budget exceeded: ${metric} = ${value} (budget: ${budget})`);
      performanceMetrics.record('budget_exceeded', value, { metric, budget });
    }

    return withinBudget;
  },

  // Bundle size budgets
  bundleBudgets: PERFORMANCE_CONFIG.bundleSizeLimits,

  // Response time budgets
  responseBudgets: PERFORMANCE_CONFIG.responseTimeThresholds,

  // Core Web Vitals budgets
  webVitalsBudgets: PERFORMANCE_CONFIG.coreWebVitals,
};

// Export utilities
export {
  performanceMetrics,
  PERFORMANCE_CONFIG,
  databasePerformance,
  apiPerformance,
  rumMonitoring,
  performanceBudgets,
};

// Next.js specific performance utilities
export const nextjsPerformance = {
  // Webpack bundle analyzer integration
  webpackBundleAnalyzer: {
    analyzerMode: 'static',
    reportFilename: './bundle-analysis.html',
    openAnalyzer: false,
    generateStatsFile: true,
    statsFilename: './bundle-stats.json',
  },

  // Optimize images
  imageOptimization: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compression: {
    compress: true,
    poweredByHeader: false,
  },
};
