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
                    {
                        key: 'Content-Security-Policy',
                        // STRICT CSP for ITS Environment
                        // Note: 'unsafe-inline' is currently required for some Next.js mechanics and Shadcn components
                        value: [
                            "default-src 'self' *.its.ac.id;",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.its.ac.id;",
                            "style-src 'self' 'unsafe-inline' fonts.googleapis.com;",
                            "font-src 'self' fonts.gstatic.com;",
                            "img-src 'self' data: blob: *.its.ac.id https://drive.google.com https://lh3.googleusercontent.com https://placehold.co;",
                            "connect-src 'self' *.supabase.co *.its.ac.id;",
                            "frame-ancestors 'self';",
                            "form-action 'self';"
                        ].join(' ')
                    },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' }
                ]
            }
        ];
    },

    distDir: '.next',
    trailingSlash: false,
    poweredByHeader: false,
};

export default nextConfig;
