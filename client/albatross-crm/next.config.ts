import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  
  // Modern CORS handling (replaces experimental.allowedDevOrigins in Next.js 15+)
  headers: async () => {
    const allowedOrigins = [
      "https://3001-firebase-albatrossaigit-1747520015427.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev",
      "https://3002-firebase-albatrossaigit-1747520015427.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev",
      "http://localhost:3000",
      "http://localhost:3002"
    ];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },

  // For Next.js 15.3.2 with Turbopack
  experimental: {
    turbo: {
      resolveAlias: {
        // Add any required aliases here
      },
    },
  },
};

export default nextConfig;