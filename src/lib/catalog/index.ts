import { countries, type Car, type CountryId } from "@/data/content";
import { catalogUrls } from "@/data/site";
import { catalogFetch } from "@/lib/catalog/catalogFetch";
import { parseCatalogCards, parseSelectOptions, type CatalogOption } from "@/lib/catalog/parse";

export type { CatalogOption };
export type CatalogBrands = Record<CountryId, CatalogOption[]>;

const PER_COUNTRY = 4;

const source = (url: URL) =>
  process.env.CATALOG_SOURCE_ORIGIN ? new URL(url.pathname + url.search, process.env.CATALOG_SOURCE_ORIGIN) : url;

const fetchSection = (id: CountryId, path = "") => catalogFetch(source(new URL(path, catalogUrls[id])).toString());

export async function getCatalog(fallback: Car[]): Promise<{ cars: Car[]; brands: CatalogBrands }> {
  const sections = await Promise.all(
    countries.map(async ({ id }) => {
      const html = await fetchSection(id);
      const cars = html ? parseCatalogCards(html, id, new URL(catalogUrls[id]).origin).slice(0, PER_COUNTRY) : [];
      return {
        id,
        cars: cars.length ? cars : fallback.filter((c) => c.country === id),
        brands: html ? parseSelectOptions(html, "brand") : [],
      };
    }),
  );
  return {
    cars: sections.flatMap((s) => s.cars),
    brands: Object.fromEntries(sections.map((s) => [s.id, s.brands])) as CatalogBrands,
  };
}

export async function getCatalogModels(id: CountryId, brand: string): Promise<CatalogOption[]> {
  const html = await fetchSection(id, `${brand}/`);
  return html ? parseSelectOptions(html, "model").map(({ value, label }) => ({ value, label })) : [];
}
