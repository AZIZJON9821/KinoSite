import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.11",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "51.20.250.43",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "kino-sayt-backend.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api-backend/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
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
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: `${process.env.BACKEND_URL || "https://kino-sayt-backend.onrender.com"}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${process.env.BACKEND_URL || "https://kino-sayt-backend.onrender.com"}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
