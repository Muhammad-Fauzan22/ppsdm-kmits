export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor' | null;
  delta: number;
  entries: PerformanceEntryList;
}

export interface PerformanceMetrics {
  lcp: WebVitalsMetric | null;
  fid: WebVitalsMetric | null;
  cls: WebVitalsMetric | null;
  fcp: WebVitalsMetric | null;
  ttfb: WebVitalsMetric | null;
}

export interface PerformanceScore {
  score: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  breakdown: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
}

export interface PerformanceRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'optimization' | 'diagnostic' | 'suggestion';
  actionable: boolean;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  };
  
  private isMonitoring = false;
  private observers: PerformanceObserver[] = [];
  private performanceEntries: PerformanceEntryList = [];

  public startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    
    // Observe Performance Timeline
    const timelineObserver = new PerformanceObserver((list) => {
      this.performanceEntries = list.getEntries();
    });
    
    timelineObserver.observe({ entryTypes: ['measure', 'mark', 'navigation', 'resource', 'paint', 'longtask'] });
    this.observers.push(timelineObserver);

    // Observe First Input Delay
    const firstInputObserver = new PerformanceObserver((list) => {
      const entry = list.getEntries()[0];
      if (entry) {
        const firstInputEntry = entry as any;
        this.metrics.fid = this.createMetric('fid', 'First Input Delay', firstInputEntry.processingStart - firstInputEntry.startTime);
      }
    });
    
    firstInputObserver.observe({ type: 'first-input', buffered: true });
    this.observers.push(firstInputObserver);

    // Observe Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let cumulativeCLS = 0;
      list.getEntries().forEach(entry => {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          cumulativeCLS += layoutShiftEntry.value;
        }
      });
      
      this.metrics.cls = this.createMetric('cls', 'Cumulative Layout Shift', cumulativeCLS);
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    this.observers.push(clsObserver);

    // Observe Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        this.metrics.lcp = this.createMetric('lcp', 'Largest Contentful Paint', lastEntry.startTime);
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    this.observers.push(lcpObserver);

    // Observe First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        this.metrics.fcp = this.createMetric('fcp', 'First Contentful Paint', entries[0].startTime);
      }
    });
    
    fcpObserver.observe({ type: 'paint', buffered: true });
    this.observers.push(fcpObserver);

    // Measure Time to First Byte
    if (window.performance) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.metrics.ttfb = this.createMetric('ttfb', 'Time to First Byte', navigationEntry.responseStart);
      }
    }

    }

  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getRecommendations(): PerformanceRecommendation[] {
    const recommendations: PerformanceRecommendation[] = [];

    if (this.metrics.lcp && this.metrics.lcp.value > 2500) {
      recommendations.push({
        id: 'lcp-optimization',
        title: 'Optimize Largest Contentful Paint',
        description: 'Your LCP metric exceeds 2.5 seconds. Consider optimizing images, fonts, and server response times.',
        impact: 'high',
        type: 'optimization',
        actionable: true
      });
    }

    if (this.metrics.fid && this.metrics.fid.value > 100) {
      recommendations.push({
        id: 'fid-optimization',
        title: 'Improve First Input Delay',
        description: 'Your FID metric exceeds 100ms. Consider optimizing JavaScript execution and reducing main thread work.',
        impact: 'high',
        type: 'optimization',
        actionable: true
      });
    }

    if (this.metrics.cls && this.metrics.cls.value > 0.1) {
      recommendations.push({
        id: 'cls-optimization',
        title: 'Reduce Layout Shifts',
        description: 'Your CLS metric exceeds 0.1. Consider adding dimensions to images and videos, and stabilizing dynamic content.',
        impact: 'high',
        type: 'optimization',
        actionable: true
      });
    }

    const resourceEntries = this.performanceEntries.filter(entry => entry.entryType === 'resource');
    const largeResources = resourceEntries.filter(entry => (entry as PerformanceResourceTiming).transferSize > 1000000);

    if (largeResources.length > 0) {
      recommendations.push({
        id: 'large-resources',
        title: 'Optimize Large Resources',
        description: `Found ${largeResources.length} resources larger than 1MB. Consider compressing images, minifying scripts, and lazy loading non-critical resources.`,
        impact: 'medium',
        type: 'suggestion',
        actionable: true
      });
    }

    return recommendations;
  }

  public calculateScore(): PerformanceScore {
    let totalScore = 0;
    let metricCount = 0;
    
    const breakdown = {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0
    };

    // LCP: 0-2500ms (100-0)
    if (this.metrics.lcp) {
      const lcpScore = Math.max(0, Math.min(100, 100 - ((this.metrics.lcp.value - 1000) / 15)));
      breakdown.lcp = Math.round(lcpScore);
      totalScore += breakdown.lcp;
      metricCount++;
    }

    // FID: 0-100ms (100-0)
    if (this.metrics.fid) {
      const fidScore = Math.max(0, Math.min(100, 100 - (this.metrics.fid.value - 50) * 2));
      breakdown.fid = Math.round(fidScore);
      totalScore += breakdown.fid;
      metricCount++;
    }

    // CLS: 0-0.1 (100-0)
    if (this.metrics.cls) {
      const clsScore = Math.max(0, Math.min(100, 100 - (this.metrics.cls.value - 0.05) * 1000));
      breakdown.cls = Math.round(clsScore);
      totalScore += breakdown.cls;
      metricCount++;
    }

    // FCP: 0-1800ms (100-0)
    if (this.metrics.fcp && this.metrics.fcp.value) {
      const fcpScore = Math.max(0, Math.min(100, 100 - ((this.metrics.fcp.value - 1000) / 8)));
      breakdown.fcp = Math.round(fcpScore);
      totalScore += breakdown.fcp;
      metricCount++;
    }

    // TTFB: 0-800ms (100-0)
    if (this.metrics.ttfb && this.metrics.ttfb.value) {
      const ttfbScore = Math.max(0, Math.min(100, 100 - (this.metrics.ttfb.value - 500) * 0.33));
      breakdown.ttfb = Math.round(ttfbScore);
      totalScore += breakdown.ttfb;
      metricCount++;
    }

    const averageScore = metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
    
    let rating: 'good' | 'needs-improvement' | 'poor' = 'poor';
    if (averageScore >= 75) rating = 'good';
    else if (averageScore >= 50) rating = 'needs-improvement';

    return {
      score: averageScore,
      rating,
      breakdown
    };
  }

  public trackWebVital(metric: WebVitalsMetric): void {
    switch (metric.name.toLowerCase()) {
      case 'lcp':
        this.metrics.lcp = metric;
        break;
      case 'fid':
        this.metrics.fid = metric;
        break;
      case 'cls':
        this.metrics.cls = metric;
        break;
      case 'fcp':
        this.metrics.fcp = metric;
        break;
      case 'ttfb':
        this.metrics.ttfb = metric;
        break;
    }
  }

  private createMetric(
    id: string,
    name: string,
    value: number
  ): WebVitalsMetric {
    let rating: 'good' | 'needs-improvement' | 'poor' | null = null;
    
    switch (id) {
      case 'lcp':
        rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
        break;
      case 'fid':
        rating = value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
        break;
      case 'cls':
        rating = value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
        break;
      case 'fcp':
        rating = value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
        break;
      case 'ttfb':
        rating = value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
        break;
    }

    return {
      id,
      name,
      value: Math.round(value * 100) / 100,
      rating,
      delta: 0,
      entries: []
    };
  }
}

export function formatMetric(value: number, metric: string): string {
  switch (metric) {
    case 'lcp':
    case 'fid':
    case 'fcp':
    case 'ttfb':
      return `${value}ms`;
    case 'cls':
      return value.toFixed(3);
    default:
      return value.toString();
  }
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function trackWebVital(metric: WebVitalsMetric, monitor: PerformanceMonitor): void {
  monitor.trackWebVital(metric);
  
  // You could also send this to an analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', `web-vitals.${metric.name}`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta
    });
  }
}

export function calculatePerformanceScore(metrics: PerformanceMetrics): PerformanceScore {
  const monitor = new PerformanceMonitor();
  Object.values(metrics).forEach(metric => {
    if (metric) {
      monitor.trackWebVital(metric);
    }
  });
  return monitor.calculateScore();
}