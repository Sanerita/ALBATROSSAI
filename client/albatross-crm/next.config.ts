import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
   

  },


  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://3001-firebase-albatrossaigit-1747520015427.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;