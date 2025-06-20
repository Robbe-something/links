import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/course',
                destination: '/home'
            }
        ]
    },
    experimental: {
        ppr: 'incremental',
    }
};

export default nextConfig;
