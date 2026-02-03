// Performance Monitoring & Analytics
// Lightweight client-side performance tracking

export interface PerformanceMetric {
    name: string;
    value: number;
    unit: string;
    timestamp: number;
    page?: string;
    userId?: string;
}

export interface CoreWebVitals {
    fcp: number;  // First Contentful Paint
    lcp: number;  // Largest Contentful Paint
    fid: number;  // First Input Delay
    cls: number;  // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
}

// Collect Core Web Vitals
export function collectWebVitals(): Partial<CoreWebVitals> {
    if (typeof window === 'undefined' || !window.performance) {
        return {};
    }

    const vitals: Partial<CoreWebVitals> = {};

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
        vitals.ttfb = navigation.responseStart - navigation.requestStart;
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    for (const entry of paintEntries) {
        if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
        }
    }

    // LCP - requires PerformanceObserver
    // FID - requires PerformanceObserver
    // CLS - requires PerformanceObserver

    return vitals;
}

// Performance Observer for LCP, FID, CLS
export function observePerformance(callback: (metric: PerformanceMetric) => void): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
        return;
    }

    // Observe Largest Contentful Paint
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            callback({
                name: 'lcp',
                value: lastEntry.startTime,
                unit: 'ms',
                timestamp: Date.now(),
                page: window.location.pathname,
            });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
        console.debug('[Performance] LCP observer not supported');
    }

    // Observe First Input Delay
    try {
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const entry of entries) {
                const fidEntry = entry as PerformanceEventTiming;
                callback({
                    name: 'fid',
                    value: fidEntry.processingStart - fidEntry.startTime,
                    unit: 'ms',
                    timestamp: Date.now(),
                    page: window.location.pathname,
                });
            }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
        console.debug('[Performance] FID observer not supported');
    }

    // Observe Cumulative Layout Shift
    try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                // Only count if not caused by user interaction
                if (!(entry as LayoutShift).hadRecentInput) {
                    clsValue += (entry as LayoutShift).value;
                }
            }
            callback({
                name: 'cls',
                value: clsValue,
                unit: 'score',
                timestamp: Date.now(),
                page: window.location.pathname,
            });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
        console.debug('[Performance] CLS observer not supported');
    }
}

// Track custom metric
export function trackMetric(name: string, value: number, unit: string = 'ms'): void {
    const metric: PerformanceMetric = {
        name,
        value,
        unit,
        timestamp: Date.now(),
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Performance]', name, value, unit);
    }

    // Send to analytics (batch later)
    queueMetric(metric);
}

// Metric queue for batching
const metricQueue: PerformanceMetric[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

function queueMetric(metric: PerformanceMetric): void {
    metricQueue.push(metric);

    // Batch send every 5 seconds
    if (!flushTimeout) {
        flushTimeout = setTimeout(flushMetrics, 5000);
    }
}

async function flushMetrics(): Promise<void> {
    if (metricQueue.length === 0) return;

    const metricsToSend = [...metricQueue];
    metricQueue.length = 0;
    flushTimeout = null;

    try {
        // Send to API
        await fetch('/api/analytics/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metrics: metricsToSend }),
            // Use keepalive to ensure metrics are sent even on page unload
            keepalive: true,
        });
    } catch (error) {
        console.error('[Performance] Failed to send metrics:', error);
    }
}

// Track page view timing
export function trackPageView(startTime: number): void {
    if (typeof window === 'undefined') return;

    const loadTime = Date.now() - startTime;
    trackMetric('page_load', loadTime);

    // Collect web vitals
    const vitals = collectWebVitals();
    if (vitals.fcp) trackMetric('fcp', vitals.fcp);
    if (vitals.ttfb) trackMetric('ttfb', vitals.ttfb);
}

// Track API call timing
export async function trackApiCall<T>(
    name: string,
    apiCall: () => Promise<T>
): Promise<T> {
    const start = performance.now();
    try {
        const result = await apiCall();
        const duration = performance.now() - start;
        trackMetric(`api_${name}`, duration);
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        trackMetric(`api_${name}_error`, duration);
        throw error;
    }
}

// Track user interaction
export function trackInteraction(
    action: string,
    target: string,
    metadata?: Record<string, unknown>
): void {
    const metric: PerformanceMetric = {
        name: `interaction_${action}`,
        value: 1,
        unit: 'count',
        timestamp: Date.now(),
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    queueMetric(metric);

    // Also log to console in dev
    if (process.env.NODE_ENV === 'development') {
        console.log('[Interaction]', action, target, metadata);
    }
}

// Memory usage tracking
export function trackMemoryUsage(): void {
    if (typeof window === 'undefined') return;

    const memory = (performance as PerformanceWithMemory).memory;
    if (!memory) return;

    trackMetric('memory_used', memory.usedJSHeapSize / (1024 * 1024), 'MB');
    trackMetric('memory_total', memory.totalJSHeapSize / (1024 * 1024), 'MB');
}

// Interface for memory API
interface PerformanceWithMemory extends Performance {
    memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
    };
}

// Interface for Layout Shift
interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}

// Interface for First Input
interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
}

// Error tracking
export function trackError(error: Error, context?: Record<string, unknown>): void {
    const metric: PerformanceMetric = {
        name: 'error',
        value: 1,
        unit: 'count',
        timestamp: Date.now(),
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    queueMetric(metric);

    // Log to console
    console.error('[Error Tracked]', error.message, context);

    // Would also send to Sentry in production:
    // Sentry.captureException(error, { extra: context });
}

// Initialize performance monitoring
export function initPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Track page load
    window.addEventListener('load', () => {
        trackPageView(performance.timing?.navigationStart || Date.now());
    });

    // Observe Core Web Vitals
    observePerformance((metric) => {
        queueMetric(metric);
    });

    // Flush metrics on page unload
    window.addEventListener('beforeunload', () => {
        flushMetrics();
    });

    // Periodic memory tracking (every 30 seconds)
    setInterval(trackMemoryUsage, 30000);

    // Global error handler
    window.addEventListener('error', (event) => {
        trackError(event.error || new Error(event.message), {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        });
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
        trackError(
            event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
            { type: 'unhandledrejection' }
        );
    });
}

const performanceMonitor = {
    collectWebVitals,
    observePerformance,
    trackMetric,
    trackPageView,
    trackApiCall,
    trackInteraction,
    trackMemoryUsage,
    trackError,
    initPerformanceMonitoring,
};

export default performanceMonitor;
