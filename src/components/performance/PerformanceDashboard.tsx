'use client';

import React, { useEffect, useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  Move, 
  MousePointerClick,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { onLCP, onFID, onCLS, onFCP, onTTFB } from 'web-vitals';

interface WebVitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

function useWebVitals() {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      setIsSupported(false);
      return;
    }

    try {
      onLCP((metric) => setMetrics((m) => ({ ...m, lcp: metric.value })));
      onFID((metric) => setMetrics((m) => ({ ...m, fid: metric.value })));
      onCLS((metric) => setMetrics((m) => ({ ...m, cls: metric.value })));
      onFCP((metric) => setMetrics((m) => ({ ...m, fcp: metric.value })));
      onTTFB((metric) => setMetrics((m) => ({ ...m, ttfb: metric.value })));
    } catch (error) {
      setIsSupported(false);
    }
  }, []);

  return { metrics, isSupported };
}


interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  status: 'good' | 'needs-improvement' | 'poor';
  icon: React.ReactNode;
  description: string;
  target: string;
}

const MetricCard = memo(function MetricCardComponent({

  title,
  value,
  unit = '',
  status,
  icon,
  description,
  target,
}: MetricCardProps) {
  const statusColors = {
    good: 'bg-green-500/10 text-green-500 border-green-500/20',
    'needs-improvement': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    poor: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const progressValue = status === 'good' ? 100 : status === 'needs-improvement' ? 60 : 30;

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-200">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${statusColors[status]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm text-slate-400">{unit}</span>
        </div>
        <Progress value={progressValue} className="h-1 mt-2" />
        <p className="text-xs text-slate-400 mt-2">{description}</p>
        <p className="text-xs text-slate-500 mt-1">Target: {target}</p>
      </CardContent>
    </Card>
  );
});

export const PerformanceDashboard = memo(function PerformanceDashboard() {
  const { metrics, isSupported } = useWebVitals();
  const [bundleSize, setBundleSize] = useState<number | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  useEffect(() => {
    // Measure bundle size
    const measureBundleSize = () => {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      scripts.forEach(script => {
        // Estimate based on typical gzip sizes
        const src = script.getAttribute('src') || '';
        if (src.includes('_next/static')) {
          totalSize += 50; // Estimate 50KB per chunk
        }
      });
      setBundleSize(totalSize);
    };

    // Measure API latency
    const measureApiLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/health', { method: 'HEAD' });
        const end = performance.now();
        setApiLatency(Math.round(end - start));
      } catch {
        setApiLatency(null);
      }
    };

    measureBundleSize();
    measureApiLatency();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      measureBundleSize();
      measureApiLatency();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isSupported) {
    return (
      <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3 text-yellow-500">
          <AlertCircle className="w-5 h-5" />
          <p>Performance API not supported in this browser</p>
        </div>
      </div>
    );
  }

  const getLCPStatus = (value: number): MetricCardProps['status'] => {
    if (value < 2500) return 'good';
    if (value < 4000) return 'needs-improvement';
    return 'poor';
  };

  const getFIDStatus = (value: number): MetricCardProps['status'] => {
    if (value < 100) return 'good';
    if (value < 300) return 'needs-improvement';
    return 'poor';
  };

  const getCLSStatus = (value: number): MetricCardProps['status'] => {
    if (value < 0.1) return 'good';
    if (value < 0.25) return 'needs-improvement';
    return 'poor';
  };

  const getFCPStatus = (value: number): MetricCardProps['status'] => {
    if (value < 1800) return 'good';
    if (value < 3000) return 'needs-improvement';
    return 'poor';
  };

  const getTTFBStatus = (value: number): MetricCardProps['status'] => {
    if (value < 800) return 'good';
    if (value < 1800) return 'needs-improvement';
    return 'poor';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
          <p className="text-slate-400">Real-time Core Web Vitals monitoring</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          <Activity className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Largest Contentful Paint"
          value={metrics.lcp ? Math.round(metrics.lcp) : '--'}
          unit="ms"
          status={metrics.lcp ? getLCPStatus(metrics.lcp) : 'poor'}
          icon={<Clock className="w-4 h-4" />}
          description="Time until largest content element is visible"
          target="< 2.5s"
        />

        <MetricCard
          title="First Input Delay"
          value={metrics.fid ? Math.round(metrics.fid) : '--'}
          unit="ms"
          status={metrics.fid ? getFIDStatus(metrics.fid) : 'poor'}
          icon={<MousePointerClick className="w-4 h-4" />}
          description="Time from first interaction to response"
          target="< 100ms"
        />

        <MetricCard
          title="Cumulative Layout Shift"
          value={metrics.cls ? metrics.cls.toFixed(3) : '--'}
          status={metrics.cls ? getCLSStatus(metrics.cls) : 'poor'}
          icon={<Move className="w-4 h-4" />}

          description="Visual stability during page load"
          target="< 0.1"
        />

        <MetricCard
          title="First Contentful Paint"
          value={metrics.fcp ? Math.round(metrics.fcp) : '--'}
          unit="ms"
          status={metrics.fcp ? getFCPStatus(metrics.fcp) : 'poor'}
          icon={<Zap className="w-4 h-4" />}
          description="Time until first content is painted"
          target="< 1.8s"
        />

        <MetricCard
          title="Time to First Byte"
          value={metrics.ttfb ? Math.round(metrics.ttfb) : '--'}
          unit="ms"
          status={metrics.ttfb ? getTTFBStatus(metrics.ttfb) : 'poor'}
          icon={<TrendingUp className="w-4 h-4" />}
          description="Server response time"
          target="< 800ms"
        />

        <MetricCard
          title="Bundle Size"
          value={bundleSize || '--'}
          unit="KB"
          status={bundleSize && bundleSize < 300 ? 'good' : bundleSize && bundleSize < 500 ? 'needs-improvement' : 'poor'}
          icon={<Activity className="w-4 h-4" />}
          description="Total JavaScript bundle size"
          target="< 300KB"
        />
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.lcp && metrics.lcp > 2500 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">LCP is slow</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Consider optimizing images and reducing server response time
                  </p>
                </div>
              </div>
            )}

            {metrics.cls && metrics.cls > 0.1 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">Layout shifts detected</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Reserve space for dynamic content to prevent layout shifts
                  </p>
                </div>
              </div>
            )}

            {apiLatency && apiLatency > 500 && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-500">High API latency</p>
                  <p className="text-xs text-slate-400 mt-1">
                    API response time is {apiLatency}ms. Consider implementing caching.
                  </p>
                </div>
              </div>
            )}

            {(!metrics.lcp || !metrics.fid || !metrics.cls) && (
              <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-500">Collecting data...</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Interact with the page to generate performance metrics
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export default PerformanceDashboard;
