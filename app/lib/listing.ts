import type { LoaderFunctionArgs } from "react-router";
import { APPLICATIONS, PRODUCTS, allFinishes, allMaterials, filterProducts, searchProducts } from "../data/products";
/**
 * Combination filters: each dimension holds MULTIPLE values (repeated URL
 * params). Within a dimension values OR; across dimensions they AND.
 */
export const PAGE_SIZE = 20;
export type FilterState = { q: string; category: string[]; finish: string[]; material: string[]; application: string[]; sort: string; page: number };
const DIMS = ["category", "finish", "material", "application"] as const;
export function parseFilters(url: URL): FilterState {
  const rawPage = parseInt(url.searchParams.get("page") ?? "1", 10);
  return { q: url.searchParams.get("q") ?? "", category: url.searchParams.getAll("category"), finish: url.searchParams.getAll("finish"), material: url.searchParams.getAll("material"), application: url.searchParams.getAll("application"), sort: url.searchParams.get("sort") ?? "featured", page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1 };
}
export function applyFilters(f: FilterState) {
  let list = filterProducts(searchProducts(f.q), f);
  if (f.sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  else if (f.sort === "name-desc") list = [...list].sort((a, b) => b.title.localeCompare(a.title));
  else if (f.sort === "featured") list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  return list;
}
export function listingLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url); const f = parseFilters(url);
  const all = applyFilters(f);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(f.page, totalPages);
  const products = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { products, filters: { ...f, page }, finishes: allFinishes, materials: allMaterials, applications: APPLICATIONS, total: PRODUCTS.length, totalFiltered: all.length, totalPages };
}
export function filterQuery(f: FilterState, patch: Partial<FilterState>): string {
  const p = new URLSearchParams();
  const merged = { ...f, ...patch };
  if (merged.q) p.set("q", merged.q);
  for (const k of DIMS) for (const v of merged[k]) p.append(k, v);
  if (merged.sort) p.set("sort", merged.sort);
  if (merged.page && merged.page > 1) p.set("page", String(merged.page));
  const s = p.toString(); return s ? `?${s}` : "";
}

export type ListingData = ReturnType<typeof listingLoader>;
