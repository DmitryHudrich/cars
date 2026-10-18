// Префикс для статики из public/. На GitHub Pages сайт живёт в подпапке (/cars),
// а обычные <img src="/..."> basePath не учитывают.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return BASE + path;
}
