import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevent ESLint from failing deployment
  },
};

export default nextConfig;
