import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["example.com", "pictureapi.pea.co.th", "pntdev.ddns.net"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "pntdev.ddns.net",
        port: "28089",
        pathname: "/VMS_PLUS/PIX/**", // Adjust the path if needed
      },
    ],
  },
  experimental: {
    turbo: {
      resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    },
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
