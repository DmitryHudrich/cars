import { cacheLife, cacheTag } from "next/cache";

export async function cmsFetch(path: string): Promise<unknown> {
  "use cache";
  cacheTag("cms");
  cacheLife("max");
  const base = process.env.CMS_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api${path}`, { signal: AbortSignal.timeout(5000) });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
