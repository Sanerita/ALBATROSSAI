import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  allowedDevOrigins: [
    "localhost:3000",
    "localhost:3002",
    "localhost:3004",
    "3003-firebase-albatrossaigit-1747520015427.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev",
    "3000-firebase-albatrossaigit-1747520015427.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev"
  ],

  webpack: (config: WebpackConfig, { isServer }) => {
    // Path aliases
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './src/components',
      '@lib': './src/lib',
    };

    // Prisma client workaround - properly typed externals handling
    if (isServer) {
      config.externals = Array.isArray(config.externals)
        ? [...config.externals, '@prisma/client', '.prisma/client']
        : config.externals
        ? [config.externals, '@prisma/client', '.prisma/client']
        : ['@prisma/client', '.prisma/client'];
    }

    return config;
  },

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
};

export default nextConfig;