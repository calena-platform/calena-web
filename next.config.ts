import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Privacy is the architecture: no analytics, no third-party SDKs, no powered-by header.
  poweredByHeader: false,
  // Clean URLs for the two standalone supply-/capital-side pages. Each is served
  // as the approved static mockup from public/, byte-faithful, with no visual
  // drift; the forms POST to /api/request (source: partners | investor).
  async rewrites() {
    return [
      { source: "/partners", destination: "/partners.html" },
      { source: "/invest", destination: "/invest.html" },
    ];
  },
};

export default nextConfig;
