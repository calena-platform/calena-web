import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Privacy is the architecture: no analytics, no third-party SDKs, no powered-by header.
  poweredByHeader: false,
};

export default nextConfig;
