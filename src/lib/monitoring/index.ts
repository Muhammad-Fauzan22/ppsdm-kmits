/**
 * Monitoring & Observability System
 * 
 * Provides comprehensive monitoring for:
 * - Performance metrics (Web Vitals)
 * - Business metrics (conversion, completion rates)
 * - Error tracking
 * - User behavior analytics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

// ==========================================
// Types
// ==========================================

export interface PerformanceMetrics {
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  fcp: number;  // First Contentful Paint
  ttfb: number; // Time to First Byte
  inp: number;  // Interaction to Next Paint
}

export interface BusinessMetrics {
  assessmentStartRate: number;
  assessmentCompletionRate: number;
  averageCompletionTime: number;
  dropoutPoints: Record<string, number>;
  userRetention: number;
}

export interface ErrorMetric {
  type: 'client' | 'server' | 'database' | 'network';
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// ==========================================
// Performance Monitoring
// ==========================================

export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  onLCP((metric) => {
    sendMetric('web-vital', {
      name: 'LCP',
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });

  onFID((metric) => {
    sendMetric('web-vital', {
      name: 'FID',
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });

  onCLS((metric) => {
    sendMetric('web-vital', {
      name: 'CLS',
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });

  onFCP((metric) => {
    sendMetric('web-vital', {
      name: 'FCP',
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });

  onTTFB((metric) => {
    sendMetric('web-vital', {
      name: 'TTFB',
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });

  onINP((metric) => {
    sendMetric('web-vital', {
      name: 'INP',
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });

  // Custom performance marks
  measureBundleSize();
  measureAPIResponseTimes();
}

function measureBundleSize() {
  if (typeof performance === 'undefined') return;

  // Measure JavaScript bundle size
  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter(r => r.name.endsWith('.js'));
  
  const totalSize = jsResources.reduce((acc, r) => {
    // @ts-ignore - transferSize may not be in all browsers
    return acc + (r.transferSize || 0);
  }, 0);

  sendMetric('bundle-size', {
    totalBytes: totalSize,
    totalMB: (totalSize / 1024 / 1024).toFixed(2),
    fileCount: jsResources.length,
  });
}

function measureAPIResponseTimes() {
  // Intercept fetch to measure API response times
  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    const start = performance.now();
    const url = args[0] instanceof Request ? args[0].url : String(args[0]);
    
    try {
      const response = await originalFetch(...args);
      const duration = performance.now() - start;
      
      // Only track API calls
      if (url.includes('/api/')) {
        sendMetric('api-response', {
          url: url.split('?')[0], // Remove query params
          method: args[0] instanceof Request ? args[0].method : 'GET',
          status: response.status,
          duration: Math.round(duration),
          cached: response.headers.get('x-cache') === 'HIT',
        });
      }
      
      return response;
    } catch (error) {
      const duration = performance.now() - start;
      
      sendMetric('api-error', {
        url: url.split('?')[0],
        method: args[0] instanceof Request ? args[0].method : 'GET',
        duration: Math.round(duration),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  };
}

// ==========================================
// Business Metrics
// ==========================================

export function trackAssessmentStart(dimension: string) {
  sendMetric('business', {
    event: 'assessment_start',
    dimension,
    timestamp: Date.now(),
  });
}

export function trackAssessmentComplete(dimension: string, duration: number, score: number) {
  sendMetric('business', {
    event: 'assessment_complete',
    dimension,
    duration,
    score,
    timestamp: Date.now(),
  });
}

export function trackAssessmentDropout(dimension: string, questionIndex: number, totalQuestions: number) {
  sendMetric('business', {
    event: 'assessment_dropout',
    dimension,
    questionIndex,
    totalQuestions,
    progress: Math.round((questionIndex / totalQuestions) * 100),
    timestamp: Date.now(),
  });
}

export function trackUserRegistration(method: 'email' | 'google' | 'github') {
  sendMetric('business', {
    event: 'user_registration',
    method,
    timestamp: Date.now(),
  });
}

export function trackDataExport(format: 'pdf' | 'json') {
  sendMetric('business', {
    event: 'data_export',
    format,
    timestamp: Date.now(),
  });
}

export function trackDataDeletionRequest() {
  sendMetric('business', {
    event: 'data_deletion_request',
    timestamp: Date.now(),
  });
}

// ==========================================
// Error Tracking
// ==========================================

export function initErrorTracking() {
  if (typeof window === 'undefined') return;

  // Global error handler
  window.addEventListener('error', (event) => {
    trackError({
      type: 'client',
      message: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    trackError({
      type: 'client',
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });
  });
}

export function trackError(error: Omit<ErrorMetric, 'userId' | 'sessionId'>) {
  const userId = getCurrentUserId();
  const sessionId = getSessionId();
  
  sendMetric('error', {
    ...error,
    userId,
    sessionId,
  });
}

// ==========================================
// Metric Sender
// ==========================================

function sendMetric(type: string, data: Record<string, any>) {
  // Add common fields
  const metric = {
    type,
    data,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  // Send to analytics endpoint
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/metrics', JSON.stringify(metric));
  } else if (typeof fetch !== 'undefined') {
    // Fallback to fetch
    fetch('/api/analytics/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch(() => {
      // Silently fail - don't break user experience
    });
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    }
}

// ==========================================
// Helpers
// ==========================================

function getCurrentUserId(): string | undefined {
  // Get from auth context or localStorage
  if (typeof localStorage !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user).id;
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}

function getSessionId(): string | undefined {
  if (typeof sessionStorage !== 'undefined') {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  return undefined;
}

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==========================================
// Real-time Dashboard Data
// ==========================================

export async function getDashboardMetrics(): Promise<{
  performance: PerformanceMetrics;
  business: BusinessMetrics;
  errors: ErrorMetric[];
}> {
  const response = await fetch('/api/analytics/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard metrics');
  }
  
  return response.json();
}

// ==========================================
// Alerting
// ==========================================

export function checkPerformanceBudget(metrics: PerformanceMetrics): string[] {
  const alerts: string[] = [];
  
  if (metrics.lcp > 2500) {
    alerts.push(`LCP exceeded budget: ${metrics.lcp}ms (budget: 2500ms)`);
  }
  
  if (metrics.fid > 100) {
    alerts.push(`FID exceeded budget: ${metrics.fid}ms (budget: 100ms)`);
  }
  
  if (metrics.cls > 0.1) {
    alerts.push(`CLS exceeded budget: ${metrics.cls} (budget: 0.1)`);
  }
  
  return alerts;
}

// Initialize monitoring
export function initMonitoring() {
  initPerformanceMonitoring();
  initErrorTracking();
}
