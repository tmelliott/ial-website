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
      // new URL("http://localhost:3000/**"),
      // new URL("https://inzight.co.nz/**"),
    ],
  },
  // compress: false,
};

export default withPayload(nextConfig);
