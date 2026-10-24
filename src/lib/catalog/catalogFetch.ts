import { cacheLife, cacheTag } from "next/cache";

export async function catalogFetch(url: string): Promise<string | null> {
  "use cache";
  cacheTag("catalog");
  cacheLife({ stale: 300, revalidate: 600, expire: 86400 });
  try {
    const res = await fetch(url, { headers: { "User-Agent": "RangAutoSite/1.0" }, signal: AbortSignal.timeout(10000) });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}
