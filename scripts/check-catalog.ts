import { parseCatalogCards } from "@/lib/catalog/parse";

const pages = [
  ["cn", "https://catalog.rangauto.ru/china-used/"],
  ["kr", "https://catalog.rangauto.ru/korea/"],
  ["jp", "https://catalog.rangauto.ru/statistika/"],
] as const;

async function main() {
  for (const [country, url] of pages) {
  const html = await (await fetch(url, { headers: { "User-Agent": "RangAutoSite/1.0" } })).text();
  const cars = parseCatalogCards(html, country, new URL(url).origin);
  console.log(`${country}: ${cars.length} машин, со шкалой: ${cars.filter((c) => c.market).length}`);
  for (const c of cars.slice(0, 4)) console.log(`  ${c.title} | ${c.price} ₽ | ${c.specs} | ${c.market?.label ?? "—"} | ${c.url}`);
}
}

main();
