import type { NextConfig } from "next";

// STATIC_EXPORT=1 — сборка статики для GitHub Pages (см. .github/workflows/pages.yml).
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStatic
  ? {
      // PPR/cacheComponents в режиме export не поддерживаются
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
      trailingSlash: true,
    }
  : {
      cacheComponents: true,
      partialPrefetching: true,
    };

export default nextConfig;
