export async function cmsFetch(path: string): Promise<unknown> {
  const base = process.env.CMS_URL;
  if (!base) return null;
  try {
    const res = await fetch(`${base}/api${path}`, { signal: AbortSignal.timeout(10000) });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
