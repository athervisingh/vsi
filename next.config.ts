import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uamavjbydjiontzwapsk.supabase.co",
      },
    ],
  },
};

export default nextConfig;
