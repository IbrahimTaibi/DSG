import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com",
      "images.unsplash.com",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
