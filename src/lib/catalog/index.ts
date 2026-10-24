import { countries, type Car } from "@/data/content";
import { catalogUrls } from "@/data/site";
import { catalogFetch } from "@/lib/catalog/catalogFetch";
import { parseCatalogCards } from "@/lib/catalog/parse";

const PER_COUNTRY = 4;

export async function getCatalogCars(fallback: Car[]): Promise<Car[]> {
  const lists = await Promise.all(
    countries.map(async ({ id }) => {
      const url = new URL(catalogUrls[id]);
      const source = process.env.CATALOG_SOURCE_ORIGIN ? new URL(url.pathname, process.env.CATALOG_SOURCE_ORIGIN) : url;
      const html = await catalogFetch(source.toString());
      const cars = html ? parseCatalogCards(html, id, url.origin).slice(0, PER_COUNTRY) : [];
      return cars.length ? cars : fallback.filter((c) => c.country === id);
    }),
  );
  return lists.flat();
}
