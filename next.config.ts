import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
  }, 
  async rewrites() {
    return [
      {
        source: '/proxy-target/:path*',
        destination: '/:path*',
      },
    ]
  },
};

export default nextConfig;
