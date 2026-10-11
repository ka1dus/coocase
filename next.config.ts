import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The parent folder has its own lockfile; pin tracing to this project.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
