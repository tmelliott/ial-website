import type { NextConfig } from "next";
import withPayload from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("http://localhost:3000/**"),
      new URL("https://inzight.co.nz/**"),
    ],
  },
};

export default withPayload(nextConfig);
