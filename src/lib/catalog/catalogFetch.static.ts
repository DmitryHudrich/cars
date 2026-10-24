export async function catalogFetch(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "RangAutoSite/1.0" }, signal: AbortSignal.timeout(15000) });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}
