import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false, // Disables the "static/dynamic" indicator
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
