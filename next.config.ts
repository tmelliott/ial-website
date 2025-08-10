import type { NextConfig } from "next";
import withPayload from "@payloadcms/next/withPayload";

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
        // pathname: "",
      },
      new URL((process.env.SERVER_URL ?? "http://localhost:3000") + "/**"),
    ],
  },
  // compress: false,
};

export default withPayload(nextConfig);
