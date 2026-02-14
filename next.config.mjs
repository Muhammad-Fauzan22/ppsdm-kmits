/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable type checking during build (we run it separately)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build (we run it separately)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Use standalone output for SSR support
  output: 'standalone',

  transpilePackages: ['@react-pdf/renderer'],

  // Disable font optimization to prevent manifest issues
  optimizeFonts: false,
  // Webpack configuration to handle Node.js modules and optimize bundle
  webpack: (config, { isServer, dev }) => {
    // Exclude Node.js modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        url: false,
        zlib: false,
        path: false,
        os: false,
        child_process: false,
      };
    }

    // Externalize heavy modules to reduce bundle size
    config.externals = config.externals || [];
    config.externals.push({
      'googleapis': 'commonjs googleapis',
      'google-auth-library': 'commonjs google-auth-library',
      'gaxios': 'commonjs gaxios',
    });

    // Split chunks for better caching
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for node_modules
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Common chunk for shared code
          common: {
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
          // AI SDKs chunk (heavy)
          ai: {
            test: /[\\/]node_modules[\\/](@ai-sdk|ai|openai|groq-sdk)[\\/]/,
            name: 'ai-vendors',
            chunks: 'all',
            priority: 15,
          },
          // PDF libraries chunk (heavy)
          pdf: {
            test: /[\\/]node_modules[\\/](jspdf|pdf-lib|@react-pdf)[\\/]/,
            name: 'pdf-vendors',
            chunks: 'all',
            priority: 15,
          },
          // Charts chunk
          charts: {
            test: /[\\/]node_modules[\\/](recharts|chart\.js)[\\/]/,
            name: 'chart-vendors',
            chunks: 'all',
            priority: 15,
          },
        },
      };
    }

    return config;
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Experimental features
  experimental: {
    optimizeCss: false,
    scrollRestoration: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
    ],
    // Disable features that cause build issues
    typedRoutes: false,
    serverComponentsExternalPackages: ['web-push'],
  },



  // Headers for static assets caching and security
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      // Immutable static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images with stale-while-revalidate
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // Next.js static chunks (immutable — hash in filename)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API responses — short cache with revalidation
      {
        source: '/api/sheets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-dashboard',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health-check',
      },
    ];
  },

  // Trailing slash configuration
  trailingSlash: false,

  // Powered by header
  poweredByHeader: false,
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA(nextConfig);
