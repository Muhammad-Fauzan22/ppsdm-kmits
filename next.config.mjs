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
  },



  // Headers for static assets caching
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
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

export default nextConfig;
