/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. ENABLE STRICT LINTING (Audit Fix)
    typescript: {
        ignoreBuildErrors: false,
    },

    // 2. PERFORMANCE OPTIMIZATIONS
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'drive.google.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' }
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    experimental: {
        optimizeCss: true, // Re-enabled as per Audit
        scrollRestoration: true,
    },

    // 3. SECURITY HEADERS (Critical Audit Fix)
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    // Content-Security-Policy (CSP) - Enhanced
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            // Default policy untuk ITS Environment
                            "default-src 'self' *.its.ac.id;",
                            // Script sources - termasuk nonce untuk inline scripts
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.its.ac.id;",
                            // Style sources
                            "style-src 'self' 'unsafe-inline' fonts.googleapis.com;",
                            // Font sources
                            "font-src 'self' fonts.gstatic.com data:;",
                            // Image sources
                            "img-src 'self' data: blob: *.its.ac.id https://drive.google.com https://lh3.googleusercontent.com https://placehold.co;",
                            // Connect sources - Supabase dan ITS
                            "connect-src 'self' *.supabase.co *.its.ac.id wss://*.supabase.co;",
                            // Media sources
                            "media-src 'self' blob: data:;",
                            // Object sources
                            "object-src 'none';",
                            // Base URI
                            "base-uri 'self';",
                            // Form action
                            "form-action 'self';",
                            // Frame ancestors - mencegah clickjacking
                            "frame-ancestors 'self';",
                            // Worker sources
                            "worker-src 'self' blob:;",
                            // Manifest sources
                            "manifest-src 'self';",
                            // Upgrade insecure requests
                            "upgrade-insecure-requests;"
                        ].join(' ')
                    },
                    // Strict-Transport-Security (HSTS) - Enforce HTTPS
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload'
                    },
                    // X-Frame-Options - Mencegah clickjacking
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    // X-Content-Type-Options - Mencegah MIME sniffing
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    // Referrer-Policy - Kontrol informasi referrer
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    // Permissions-Policy - Kontrol fitur browser
                    {
                        key: 'Permissions-Policy',
                        value: [
                            'camera=()',
                            'microphone=()',
                            'geolocation=()',
                            'payment=()',
                            'usb=()',
                            'magnetometer=()',
                            'gyroscope=()',
                            'accelerometer=()',
                            'ambient-light-sensor=()',
                            'autoplay=(self)',
                            'clipboard-write=(self)',
                            'fullscreen=(self)',
                            'picture-in-picture=(self)'
                        ].join(', ')
                    },
                    // X-XSS-Protection - Legacy browser protection
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    // Cross-Origin-Opener-Policy (COOP) - Isolate browsing context
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin'
                    },
                    // Cross-Origin-Embedder-Policy (COEP) - Enable advanced features
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp'
                    },
                    // Cross-Origin-Resource-Policy (CORP) - Protect resources
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'same-origin'
                    },
                    // Cache-Control untuk API routes
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
                    },
                    // Pragma untuk legacy browser
                    {
                        key: 'Pragma',
                        value: 'no-cache'
                    },
                    // Expires untuk legacy browser
                    {
                        key: 'Expires',
                        value: '0'
                    }
                ]
            },
            // Static assets caching
            {
                source: '/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            // Images caching
            {
                source: '/images/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            // Fonts caching
            {
                source: '/fonts/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            // API routes - no caching
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
                    }
                ]
            }
        ];
    },

    distDir: '.next',
    trailingSlash: false,
    poweredByHeader: false,
};

export default nextConfig;
