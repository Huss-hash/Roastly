import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Roastly fetches arbitrary third-party pages server-side in /api/roast,
  // so we keep this default (no special image domains / rewrites needed for v1).
  reactStrictMode: true,
};

export default nextConfig;
