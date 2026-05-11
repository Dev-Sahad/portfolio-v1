import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      // Outputs a static 'out' folder
  images: {
    unoptimized: true,   // Required for static sites
  },
  // If your repo name is 'portfolio-v1', uncomment the next line:
  // basePath: '/portfolio-v1', 
};

export default nextConfig;
