const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    reactStrictMode: true,
    transpilePackages: ["@leaseqa/ui"],
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.API_PROXY_URL || "http://localhost:4050"}/api/:path*`, // Proxy to Backend
            },
        ];
    },
};

export default nextConfig;
