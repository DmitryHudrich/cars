import type { NextConfig } from "next";

// STATIC_EXPORT=1 — статика для GitHub Pages (ветка main, .github/workflows/pages.yml).
// Иначе — standalone-сервер для продакшена (ветка production, .github/workflows/deploy.yml).
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStatic
  ? {
      // PPR/cacheComponents в режиме export не поддерживаются
      output: "export",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
      trailingSlash: true,
      turbopack: {
        resolveAlias: { "@/lib/cms/cmsFetch": "./src/lib/cms/cmsFetch.static.ts" },
      },
    }
  : {
      output: "standalone",
      cacheComponents: true,
      partialPrefetching: true,
    };

export default nextConfig;
