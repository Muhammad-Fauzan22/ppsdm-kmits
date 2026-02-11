import { NextConfig } from 'next';
import React from 'react';

// Bundle optimization configuration
export const bundleOptimizationConfig: Partial<NextConfig> = {
  // SWC minification is enabled by default in Next.js 16+
  // swcMinify: true, // Removed - not needed in Next.js 16+

  // Optimize CSS
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Bundle analyzer (conditionally enabled)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any, { buildId, dev, isServer, defaultLoaders, webpack }: any) => {
      // Add bundle analyzer
      if (!dev && !isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze/client.html',
            openAnalyzer: false,
          })
        );
      }

      // Optimize chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
            chartjs: {
              test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
              name: 'chartjs',
              chunks: 'all',
              priority: 15,
            },
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };

      return config;
    },
  }),

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Headers for caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

// Lazy loading utilities
export const lazyLoadUtils = {
  // Dynamic imports for heavy components
  loadComponent: (importFn: () => Promise<any>) => {
    return React.lazy(importFn);
  },

  // Intersection Observer for lazy loading
  createIntersectionObserver: (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) => {
    if (typeof window === 'undefined') return null;

    return new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });
  },

  // Preload critical resources
  preloadCritical: () => {
    if (typeof window === 'undefined') return;

    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/critical-font.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // Preload critical images
    const heroImage = new Image();
    heroImage.src = '/images/hero-critical.jpg';
    heroImage.loading = 'eager';
  },
};

// Code splitting strategies
export const codeSplittingStrategies = {
  // Route-based splitting
  routeBased: {
    // Dashboard routes
    dashboard: () => import('@/app/dashboard/page'),
    assessment: () => import('@/app/dashboard/character/assessment/page'),
    courses: () => import('@/app/dashboard/courses/page'),
  },

  // Component-based splitting
  componentBased: {
    // Heavy components
    charts: () => import('@/components/Charts'),
    dataVisualization: () => import('@/components/visualizations/HolisticRadarChart'),

    // UI libraries
  },

  // Feature-based splitting
  featureBased: {
    // Assessment features
    cognitive: () => import('@/components/assessment/CognitiveAssessment'),
    emotional: () => import('@/components/assessment/EmotionalAssessment'),
    physical: () => import('@/components/assessment/PhysicalAssessment'),

    // Gamification features
  },
};

// Performance monitoring
export const performanceMonitoring = {
  // Core Web Vitals tracking
  trackWebVitals: ({ name, value, id }: any) => {
    // Send to analytics service
    console.log('Web Vital:', { name, value, id });

    // In production, send to your analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics, Mixpanel, etc.
      // gtag('event', name, { value: Math.round(value) });
    }
  },

  // Bundle size monitoring
  trackBundleSize: (bundleName: string, size: number) => {
    const sizeMB = (size / 1024 / 1024).toFixed(2);
    console.log(`Bundle size: ${bundleName} - ${sizeMB}MB`);

    // Alert if bundle is too large
    if (size > 500 * 1024) { // 500KB
      console.warn(`Large bundle detected: ${bundleName} - ${sizeMB}MB`);
    }
  },

  // Loading performance
  trackComponentLoad: (componentName: string, loadTime: number) => {
    // Alert for slow components
    if (loadTime > 1000) { // 1 second
      console.warn(`Slow component load: ${componentName} - ${loadTime}ms`);
    }
  },
};

// Resource hints
export const resourceHints = {
  // DNS prefetch
  dnsPrefetch: (domains: string[]) => {
    if (typeof window === 'undefined') return;

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  },

  // Preconnect
  preconnect: (domains: string[]) => {
    if (typeof window === 'undefined') return;

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `//${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },

  // Prefetch
  prefetch: (urls: string[]) => {
    if (typeof window === 'undefined') return;

    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  },

  // Preload
  preload: (resources: Array<{ href: string; as: string; type?: string }>) => {
    if (typeof window === 'undefined') return;

    resources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  },
};

// Service Worker for caching
export const serviceWorkerConfig = {
  // Cache strategies
  cacheStrategies: {
    // Cache static assets
    static: {
      cacheName: 'ppsdm-static-v1',
      patterns: [
        /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        /\.(?:css|js)$/,
        /\/_next\/static\//,
      ],
    },

    // Cache API responses
    api: {
      cacheName: 'ppsdm-api-v1',
      patterns: [
        /\/api\/dimensions/,
        /\/api\/goals/,
        /\/api\/courses/,
      ],
      maxAge: 5 * 60 * 1000, // 5 minutes
    },

    // Cache images
    images: {
      cacheName: 'ppsdm-images-v1',
      patterns: [
        /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      ],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // Offline fallback
  offlineFallback: {
    '/': '/offline.html',
    '/dashboard': '/offline.html',
  },
};

// Bundle size limits
export const bundleSizeLimits = {
  // Main bundle
  main: 200 * 1024, // 200KB

  // Vendor bundles
  vendor: 500 * 1024, // 500KB
  react: 150 * 1024, // 150KB
  chartjs: 200 * 1024, // 200KB
  ui: 100 * 1024, // 100KB

  // Page bundles
  page: 100 * 1024, // 100KB per page
};

// Webpack configuration for bundle analysis
export const webpackBundleAnalyzer = {
  analyzerMode: 'static',
  reportFilename: './bundle-analysis.html',
  openAnalyzer: false,
  generateStatsFile: true,
  statsFilename: './bundle-stats.json',
};

