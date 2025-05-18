import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Modern CORS handling (Next.js 13.4+)
  allowedDevOrigins: [
    "localhost:3000",
    "localhost:3002",
    "localhost:3004",
    "3003-firebase-albatrossaigit-1747520015427.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev"
  ],

  // Production CORS configuration
  async headers() {
    return process.env.NODE_ENV === 'production' ? [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: [
              "https://albatrossai.web.app",
              "https://*.albatrossai.com",
              "https://*.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev"
            ].join(', '),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-CSRF-Token, X-Requested-With",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      }
    ] : [];
  },


  // Modern aliasing (better than Turbopack approach)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './src/components',
      '@lib': './src/lib',
    };
    return config;
  },
};

export default nextConfig;