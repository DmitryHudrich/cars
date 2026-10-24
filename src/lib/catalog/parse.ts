import type { Car, CountryId } from "@/data/content";

const ENTITIES: Record<string, string> = { nbsp: " ", amp: "&", quot: '"', lt: "<", gt: ">", mdash: "—", ndash: "–", laquo: "«", raquo: "»" };

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

const text = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const money = (s: string) => Number(text(s).replace(/\D/g, ""));

const meta = (block: string, prop: string) =>
  block.match(new RegExp(`itemprop="${prop}"\\s+content="([^"]*)"`))?.[1];

function tone(cls: string, label: string): "up" | "down" | "mid" {
  if (/is-good/.test(cls) || /^Дешевле/i.test(label)) return "down";
  if (/is-high/.test(cls) || /^Дороже/i.test(label)) return /is-mid/.test(cls) ? "mid" : "up";
  return "mid";
}

export function parseCatalogCards(html: string, country: CountryId, origin: string): Car[] {
  const cars: Car[] = [];
  for (const [block] of html.matchAll(/<article class="card"[\s\S]*?<\/article>/g)) {
    const id = block.match(/data-id="([^"]+)"/)?.[1];
    const href = block.match(/class="card__title"\s+href="([^"]+)"/)?.[1] ?? block.match(/class="card__photo"\s+href="([^"]+)"/)?.[1];
    const title = text(block.match(/class="card__title"[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? "") || decode(meta(block, "name") ?? "");
    const price = Number(meta(block, "price") ?? 0);
    const img = meta(block, "image") ?? block.match(/<img src="([^"]+)"/)?.[1];
    if (!id || !title || !price || !img) continue;

    const specsHtml = block.match(/class="card__specs">([\s\S]*?)<\/div>/)?.[1] ?? "";
    const specs = [...specsHtml.matchAll(/<span><i>[^<]*<\/i>([^<]*)<\/span>/g)].map((m) => decode(m[1]).trim()).filter(Boolean);

    const ends = [...block.matchAll(/class="pgauge__end">([^<]*)</g)].map((m) => money(m[1]));
    const rate = block.match(/class="pgauge__rate([^"]*)">([^<]*)</);
    const position = Number(block.match(/pgauge__mark"\s+style="left:\s*([\d.]+)%/)?.[1]);
    const label = rate ? text(rate[2]) : "";

    cars.push({
      id,
      country,
      title,
      price,
      specs: specs.join(" · "),
      img,
      url: href ? new URL(href, origin).toString() : undefined,
      priceDrop: text(block.match(/class="badge badge--deal">([\s\S]*?)<\/span>/)?.[1] ?? "") || undefined,
      market:
        ends.length === 2 && label && Number.isFinite(position)
          ? { min: ends[0], max: ends[1], position: position / 100, label, tone: tone(rate![1], label) }
          : undefined,
    });
  }
  return cars;
}
