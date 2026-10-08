import type { NextConfig } from "next";
import withPayload from "@payloadcms/next/withPayload";
import withPlaiceholder from "@plaiceholder/next";

const nextConfig: NextConfig = {
  // Set NEXT_STANDALONE=1 for the admin container build. Leave unset on Vercel.
  output: process.env.NEXT_STANDALONE === "1" ? "standalone" : undefined,
  experimental: {
    staticGenerationMaxConcurrency: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inzight.co.nz",
      },
      {
        protocol: "https",
        hostname: "object-storage.nz-por-1.catalystcloud.io",
        port: "443",
      },
      new URL((process.env.SERVER_URL ?? "http://localhost:3000") + "/**"),
    ],
  },
  async rewrites() {
    return [
      {
        source: "/projects",
        destination: "/projects/page/1",
      },
      {
        source: "/horizon-europe",
        destination: "/keywords/horizon-europe",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/keywords/horizon-europe",
        destination: "/horizon-europe",
        permanent: true,
      },
      {
        source: "/projects/political-polling-guide",
        destination: "/projects/understanding-public-opinion-polls-in-new-zealand",
        permanent: true,
      },
      {
        source: "/projects/matau",
        destination: "/apps#matau",
        permanent: true,
      }
    ];
  },
  // compress: false,
};

export default withPlaiceholder(withPayload(nextConfig));
