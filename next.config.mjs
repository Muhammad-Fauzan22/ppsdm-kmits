/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
                pathname: '/**',
            }
        ],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
        // Disable features that may cause manifest issues with route groups
        optimizeCss: false,
        scrollRestoration: false,
    },
    // Configure output for static export compatibility
    output: 'standalone',
    // Ensure trailing slashes are handled correctly
    trailingSlash: false,
    // Disable powered by header
    poweredByHeader: false,
};

export default nextConfig;
