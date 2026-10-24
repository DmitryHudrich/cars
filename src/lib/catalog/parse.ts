import type { Car, CountryId } from "@/data/content";

const ENTITIES: Record<string, string> = { nbsp: " ", amp: "&", quot: '"', lt: "<", gt: ">", mdash: "—", ndash: "–", laquo: "«", raquo: "»" };

const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

const text = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const money = (s: string) => Number(text(s).replace(/\D/g, ""));

const meta = (block: string, prop: string) => block.match(new RegExp(`itemprop="${prop}"\\s+content="([^"]*)"`))?.[1];

const DRIVES: Record<string, string> = { FWD: "Передний", RWD: "Задний", AWD: "Полный", "4WD": "Полный" };

function spec(raw: string) {
  const volume = raw.match(/^(\d{3,5})\s*(см|сс|cc)/i);
  if (volume) return `${(Number(volume[1]) / 1000).toFixed(1)} л`;
  const power = raw.match(/^([\d.,]+)\s*л\.с\./);
  if (power) return `${Math.round(Number(power[1].replace(",", ".")))} л.с.`;
  if (DRIVES[raw.toUpperCase()]) return DRIVES[raw.toUpperCase()];
  if (/^автомат/i.test(raw) || /\(AT\)|\(АТ\)/.test(raw)) return "Автомат";
  if (/механ/i.test(raw)) return "Механика";
  if (/вариатор/i.test(raw)) return "Вариатор";
  if (/робот/i.test(raw)) return "Робот";
  if (!/[а-яё]/i.test(raw) || /^\d{2}\.\d{2}\.\d{4}$/.test(raw)) return "";
  return raw;
}

function tone(cls: string): "up" | "down" | "mid" {
  if (cls === "good") return "down";
  if (cls === "high") return "up";
  return "mid";
}

export function parseCatalogCards(html: string, country: CountryId, origin: string): Car[] {
  const starts = [...html.matchAll(/<div class="card-row[^"]*"[^>]*itemtype="http:\/\/schema\.org\/Car"/g)].map((m) => m.index!);
  const cars: Car[] = [];

  starts.forEach((start, i) => {
    const block = html.slice(start, starts[i + 1] ?? start + 20000);
    const nameLink = block.match(/class="card-row__name"\s+href="([^"]+)"\s*>([\s\S]*?)(?:<div|<\/a>)/);
    const href = nameLink?.[1];
    const name = (nameLink ? text(nameLink[2]) : "") || decode(meta(block, "name") ?? "");
    const price = Math.round(Number(meta(block, "price") ?? 0)) || money(block.match(/class="price-val">([^<]*)/)?.[1] ?? "");
    const img = block.match(/<img[^>]*\ssrc="(https?:[^"]+)"/)?.[1] ?? meta(block, "image");
    if (!href || !name || !price || !img) return;

    const age = [...(block.match(/class="card-row__age">([\s\S]*?)<\/div>/)?.[1] ?? "").matchAll(/<span>([\s\S]*?)<\/span>/g)].map((m) => text(m[1]));
    const mileage = age.find((a) => /км/.test(a));
    const date = age.find((a) => /\d{4}/.test(a) && !/км/.test(a))?.replace(/\s*г\.?$/, "");

    const info = block.slice(block.indexOf("card-row__info"), block.indexOf("card-row__price"));
    const specs = [...info.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)].map((m) => spec(text(m[1]))).filter(Boolean);
    if (mileage) specs.push(mileage);

    const zone = block.match(/compare-price--(good|mid|high)/)?.[1];
    const min = block.match(/class="compare-price__min">([^<]*)</)?.[1];
    const max = block.match(/class="compare-price__max">([^<]*)</)?.[1];
    const label = text(block.match(/class="compare-price__value">([^<]*)</)?.[1] ?? "");
    const position = Number(block.match(/compare-price__dot"\s+style="left:\s*([\d.]+)%/)?.[1]);

    cars.push({
      id: href,
      country,
      title: date ? `${name}, ${date}` : name,
      price,
      specs: [...new Set(specs)].join(" · "),
      img,
      url: new URL(href, origin).toString(),
      market:
        zone && min && max && label && Number.isFinite(position)
          ? { min: money(min), max: money(max), position: position / 100, label, tone: tone(zone) }
          : undefined,
    });
  });

  return cars;
}

export type CatalogOption = { value: string; label: string; popular?: boolean };

export function parseSelectOptions(html: string, name: string): CatalogOption[] {
  const select = html.match(new RegExp(`<select[^>]*name="${name}"[^>]*>([\\s\\S]*?)</select>`))?.[1] ?? "";
  return [...select.matchAll(/<option([^>]*)value=['"]([^'"]+)['"]([^>]*)>([\s\S]*?)<\/option>/g)]
    .map((m) => ({
      value: m[2],
      label: text(m[4]).replace(/\s*\([\d\s]+\)$/, ""),
      popular: /class=["'][^"']*bold/.test(m[1] + m[3]) || undefined,
    }))
    .filter((o) => o.label);
}
