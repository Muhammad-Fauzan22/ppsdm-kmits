/**
 * Performance Monitoring Utilities
 * Track and monitor application performance metrics
 */

import { logger, logPerformance } from './logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track function execution time
  async track<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMetric(name, duration, metadata);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, { ...metadata, error: true });
      throw error;
    }
  }

  // Track sync function execution time
  trackSync<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    const start = performance.now();
    
    try {
      const result = fn();
      const duration = performance.now() - start;
      
      this.recordMetric(name, duration, metadata);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(name, duration, { ...metadata, error: true });
      throw error;
    }
  }

  // Record a metric
  private recordMetric(name: string, duration: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date(),
      metadata
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations (> 1 second)
    if (duration > 1000) {
      logger.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`, {
        operation: name,
        duration,
        ...metadata
      });
    }

    // Log to performance logger
    logPerformance(name, duration, metadata);
  }

  // Get metrics statistics
  getStats(name?: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
  } {
    const relevantMetrics = name
      ? this.metrics.filter(m => m.name === name)
      : this.metrics;

    if (relevantMetrics.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0, p95: 0 };
    }

    const durations = relevantMetrics.map(m => m.duration).sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const min = durations[0];
    const max = durations[durations.length - 1];
    const p95Index = Math.floor(durations.length * 0.95);
    const p95 = durations[p95Index] || max;

    return {
      count: durations.length,
      avg,
      min,
      max,
      p95
    };
  }

  // Get slowest operations
  getSlowestOperations(limit: number = 10): PerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  // Get metrics by name
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  // Clear all metrics
  clear(): void {
    this.metrics = [];
  }

  // Export metrics for external analysis
  exportMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Decorator for tracking method performance
export function TrackPerformance(metadata?: Record<string, any>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const className = target.constructor.name;
      const methodName = `${className}.${propertyKey}`;
      
      return performanceMonitor.track(
        methodName,
        () => originalMethod.apply(this, args),
        { ...metadata, args: args.map(a => typeof a) }
      );
    };

    return descriptor;
  };
}

// Middleware for tracking API request performance
export function trackAPIPerformance(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    const start = performance.now();
    const url = new URL(req.url);
    
    try {
      const response = await handler(req);
      const duration = performance.now() - start;
      
      logger.info(`API Request: ${req.method} ${url.pathname}`, {
        method: req.method,
        path: url.pathname,
        status: response.status,
        duration: duration.toFixed(2),
        type: 'api_performance'
      });

      return response;
    } catch (error) {
      const duration = performance.now() - start;
      
      logger.error(`API Request Failed: ${req.method} ${url.pathname}`, {
        method: req.method,
        path: url.pathname,
        duration: duration.toFixed(2),
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  };
}

// Web Vitals tracking (for client-side)
export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB';
  value: number;
  id: string;
  delta?: number;
}

export function trackWebVitals(metric: WebVitalsMetric): void {
  logger.info(`Web Vital: ${metric.name}`, {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    type: 'web_vitals'
  });

  // Alert on poor performance
  const thresholds: Record<string, number> = {
    'CLS': 0.1,
    'FCP': 1800,
    'FID': 100,
    'LCP': 2500,
    'TTFB': 600
  };

  if (metric.value > thresholds[metric.name]) {
    logger.warn(`Poor ${metric.name} detected: ${metric.value}`, {
      metric: metric.name,
      value: metric.value,
      threshold: thresholds[metric.name],
      type: 'web_vitals_warning'
    });
  }
}

// Database query performance tracking
export function trackQueryPerformance<T>(
  queryName: string,
  queryFn: () => Promise<T>,
  tableName?: string
): Promise<T> {
  return performanceMonitor.track(
    `db_query:${queryName}`,
    queryFn,
    { type: 'database', table: tableName }
  );
}
