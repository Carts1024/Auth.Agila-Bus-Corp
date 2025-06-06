import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/auth/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
