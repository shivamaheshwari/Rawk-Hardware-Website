import type { LoaderFunctionArgs } from "react-router";
import { APPLICATIONS, PRODUCTS, allFinishes, allMaterials, filterProducts, searchProducts } from "../data/products";
/**
 * Combination filters: each dimension holds MULTIPLE values (repeated URL
 * params). Within a dimension values OR; across dimensions they AND.
 */
export type FilterState = { q: string; category: string[]; finish: string[]; material: string[]; application: string[]; sort: string };
const DIMS = ["category", "finish", "material", "application"] as const;
export function parseFilters(url: URL): FilterState {
  return { q: url.searchParams.get("q") ?? "", category: url.searchParams.getAll("category"), finish: url.searchParams.getAll("finish"), material: url.searchParams.getAll("material"), application: url.searchParams.getAll("application"), sort: url.searchParams.get("sort") ?? "featured" };
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
  if (merged.q) p.set("q", merged.q);
  for (const k of DIMS) for (const v of merged[k]) p.append(k, v);
  if (merged.sort) p.set("sort", merged.sort);
  const s = p.toString(); return s ? `?${s}` : "";
}

export type ListingData = ReturnType<typeof listingLoader>;
