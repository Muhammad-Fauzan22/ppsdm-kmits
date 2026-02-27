/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,

  // Security headers (also set in middleware, but belt-and-suspenders for static routes)
  async headers() {
    return [
      {
        // Static assets - cache for 1 year
        source: '/(.*)\\.(jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|woff|woff2|ttf|eot)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes - no caching
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'integrate.api.nvidia.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'books.google.com' },
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },

  // Bundle analyzer (conditionally enabled)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze/client.html',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    // Tree-shake large icon/component libraries
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'framer-motion',
      'recharts',
    ],
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Fix workspace root inference
  outputFileTracingRoot: process.cwd(),

  // Output mode
  output: 'standalone',

  // TypeScript configuration - NEVER ignore errors
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration - NEVER ignore during builds
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

export default nextConfig;
