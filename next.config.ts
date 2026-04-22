import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  async redirects() {
    return [
      { source: "/github", destination: "https://github.com/SmartQHSE/hse-calculators", permanent: false },
      { source: "/npm", destination: "https://www.npmjs.com/package/@smartqhse/hse-calculators", permanent: false },
      { source: "/platform", destination: "https://www.smartqhse.com", permanent: false },
    ];
  },
};

export default config;
