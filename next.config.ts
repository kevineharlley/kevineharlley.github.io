import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
    useTypeScriptCli: true,
  },
};

export default nextConfig;
