import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/course',
                destination: '/home'
            }
        ]
    }
};

export default nextConfig;
