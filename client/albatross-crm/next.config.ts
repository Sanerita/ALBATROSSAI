import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Production CORS configuration
  headers: async () => {
    const allowedOrigins = [
      // Development
      "http://localhost:3000",
      "http://localhost:3002",
      "http://localhost:3004",
      
      // Production/staging domains
      "https://albatrossai.com",
      "https://*.albatrossai.com",
      
      // Cloud workstation domains
      "https://*.cluster-vpxjqdstfzgs6qeiaf7rdlsqrc.cloudworkstations.dev"
    ];

    return [{
      source: "/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: process.env.NODE_ENV === 'development' 
            ? '*' 
            : allowedOrigins.join(','),
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: [
            "Content-Type",
            "Authorization",
            "X-CSRF-Token",
            "X-Requested-With"
          ].join(', '),
        },
        {
          key: "Access-Control-Allow-Credentials",
          value: "true",
        },
      ],
    }];
  },

  // Turbopack configuration (Next.js 15+)
  turbopack: {
    resolveAlias: {
      // Example aliases:
      '@components': './src/components',
      '@lib': './src/lib',
    },
  },

 
};

export default nextConfig;