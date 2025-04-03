import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'pntdev.ddns.net',
        port: '28089',
        pathname: '/VMS_PLUS/PIX/**', // Adjust the path if needed
      },
    ],
  },
  experimental: {
    turbo: {
        resolveExtensions: [
            '.mdx',
            '.tsx',
            '.ts',
            '.jsx',
            '.js',
            '.mjs',
            '.json',
          ],
    },
  }
  
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
