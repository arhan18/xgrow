import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Keep tracing and Turbopack rooted in this repo, even though the parent
  // directory (/Volumes/Arhan/Work) also contains package.json files.
  outputFileTracingRoot: rootDir,
  turbopack: { root: rootDir },
};

export default nextConfig;
