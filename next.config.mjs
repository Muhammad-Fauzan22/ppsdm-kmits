import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,


  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), camera=(), microphone=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';"
          }
        ]
      },
      {
        // Static assets - cache for 1 year
        source: '/(.*).(jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|woff|woff2|ttf|eot)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // API routes - additional security
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ];
  },

  async redirects() {
    return [
      {
        source: '/assessment/:path*',
        destination: '/dashboard/assessment/:path*',
        permanent: true,
      },
      {
        source: '/roadmap',
        destination: '/dashboard/roadmap',
        permanent: true,
      },
      {
        source: '/pos',
        destination: '/dashboard/pos',
        permanent: true,
      },
      {
        source: '/mentorship',
        destination: '/dashboard/mentoring',
        permanent: true,
      },
      {
        source: '/profile/scholar',
        destination: '/dashboard/profile',
        permanent: true,
      },
      {
        source: '/profile',
        destination: '/dashboard/profile',
        permanent: true,
      },
      {
        source: '/portfolio/:path*',
        destination: '/dashboard/portfolio/:path*',
        permanent: true,
      },
      {
        source: '/community',
        destination: '/dashboard/community',
        permanent: true,
      },
      {
        source: '/settings',
        destination: '/dashboard/settings',
        permanent: true,
      }
    ];
  },

  // Image optimization
  images: {
    domains: ['lh3.googleusercontent.com', 'integrate.api.nvidia.com', 'ppsdm.its.ac.id', 'images.unsplash.com', 'drive.google.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },


  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer - always enabled in analyze mode
    if (process.env.ANALYZE === 'true' && !dev && !isServer) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze/client.html',
          openAnalyzer: false,
          generateStatsFile: true,
          statsFilename: './analyze/stats.json',
        })
      );
    }

    // Optimize chunk splitting
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }

    return config;
  },


  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    // Enable code splitting and tree shaking for better performance
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', '@radix-ui/react-icons'],
    webVitalsAttribution: ['CLS', 'INP', 'FCP', 'LCP', 'TTFB'],
  },



  // Build optimization
  // swcMinify: true, // Deprecated in Next.js 15+ (default is true)

  // Enable React strict mode
  reactStrictMode: true,

  // Fix workspace root inference
  outputFileTracingRoot: process.cwd(),

  // Output mode
  output: 'standalone',

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Static page generation timeout (for heavy pages)
  staticPageGenerationTimeout: 300,

  // Handle pages with dynamic content that can't be prerendered
  onDemandEntries: {
    // Period (in ms) where server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
};


// Export without PWA wrapper
export default nextConfig;
