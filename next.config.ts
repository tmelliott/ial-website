import type { NextConfig } from "next";
import withPayload from "@payloadcms/next/withPayload";
import withPlaiceholder from "@plaiceholder/next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "standalone", // for self-hosting
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
    ];
  },
  // compress: false,
};

export default withPlaiceholder(withPayload(nextConfig));
