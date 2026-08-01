import type { NextConfig } from "next";

/**
 * GitHub Pages project site: https://<user>.github.io/tin-ai-lens/
 * CI sets NEXT_PUBLIC_BASE_PATH=/tin-ai-lens. Local/custom domain at root: leave unset.
 */
const basePath = (
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_ACTIONS === "true" ? "/tin-ai-lens" : "")
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
