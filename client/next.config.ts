import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "www.ipcc.ch",
      },
      {
        protocol: "https",
        hostname: "climateactiontracker.org",
      },
      {
        protocol: "https",
        hostname: "images.climatecentral.org",
      },
      {
        protocol: "https",
        hostname: "www.esa.int",
      },
      {
        protocol: "https",
        hostname: "showyourstripes.info",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
