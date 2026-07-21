import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");

    if (process.env.NODE_ENV === "production" && !apiProxyTarget) {
      throw new Error("API_PROXY_TARGET is required in production");
    }

    if (!apiProxyTarget) {
      return [];
    }

    return [
      {
        source: "/backend/:path*",
        destination: `${apiProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;