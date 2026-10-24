import { countries } from "@/data/content";
import { getCatalogModels } from "@/lib/catalog";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const country = countries.find((c) => c.id === params.get("country"))?.id;
  const brand = params.get("brand") ?? "";
  if (!country || !/^[a-z0-9-]{1,40}$/.test(brand)) {
    return Response.json({ models: [] }, { status: 400 });
  }
  const models = await getCatalogModels(country, brand);
  return Response.json({ models }, { headers: { "Cache-Control": "public, max-age=600" } });
}
