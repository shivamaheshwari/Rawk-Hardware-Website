import type { LoaderFunctionArgs } from "react-router";
import { APPLICATIONS, PRODUCTS, allFinishes, allMaterials, filterProducts, searchProducts } from "../data/products";
export type FilterState = { q: string; category: string; finish: string; material: string; application: string; sort: string };
export function parseFilters(url: URL): FilterState {
  return { q: url.searchParams.get("q") ?? "", category: url.searchParams.get("category") ?? "", finish: url.searchParams.get("finish") ?? "", material: url.searchParams.get("material") ?? "", application: url.searchParams.get("application") ?? "", sort: url.searchParams.get("sort") ?? "featured" };
}
export function applyFilters(f: FilterState) {
  let list = filterProducts(searchProducts(f.q), f);
  if (f.sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  else if (f.sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  return list;
}
export function listingLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url); const f = parseFilters(url);
  return { products: applyFilters(f), filters: f, finishes: allFinishes, materials: allMaterials, applications: APPLICATIONS, total: PRODUCTS.length };
}
export function filterQuery(f: FilterState, patch: Partial<FilterState>): string {
  const p = new URLSearchParams();
  const merged = { ...f, ...patch };
  (Object.keys(merged) as (keyof FilterState)[]).forEach((k) => { if (merged[k]) p.set(k, merged[k]); });
  const s = p.toString(); return s ? `?${s}` : "";
}

export type ListingData = ReturnType<typeof listingLoader>;
