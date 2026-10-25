import { useEffect, useRef } from "react";
import { Link, useLoaderData, useNavigate, type MetaFunction } from "react-router";
import { listingLoader, filterQuery, type FilterState, type ListingData } from "../lib/listing";
import { canonical } from "../lib/seo";
import { CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import ListingBanner from "../components/ListingBanner";
import FilterBar, { SortControl, scrollToResults, type FilterValues } from "../components/FilterBar";
import { whatsappUrl } from "../lib/site";
export const loader = listingLoader;
export const meta: MetaFunction = () => [{ title: "All Products | RAWK" }, { name: "description", content: "Browse all RAWK handles, knobs, locks, hinges, drain jali and drain pipes. Filter by category, finish, material and application." }, { tagName: "link", rel: "canonical", href: canonical("/products") }];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name A–Z" },
];

const toggleIn = (arr: string[], value: string) => (arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

export default function Products() {
  const { products, filters, finishes, materials, applications, total } = useLoaderData() as ListingData;
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollFlag = useRef(false);
  // After a filter apply, scroll to the results (never back to the banner):
  // the top card row and the showing-result text land just below the
  // sticky header + filter bar, with a gap. Navigations here use
  // preventScrollReset so the router itself never jumps to the top.
  useEffect(() => {
    if (scrollFlag.current) { scrollFlag.current = false; scrollToResults(resultsRef.current); }
  }, [products]);
  const go = (patch: Partial<FilterState>) => { scrollFlag.current = true; navigate(`/products${filterQuery(filters, patch)}`, { preventScrollReset: true }); };
  const values: FilterValues = {
    category: filters.category, finish: filters.finish, material: filters.material, application: filters.application,
  };
  const activeCount = filters.category.length + filters.finish.length + filters.material.length + filters.application.length + (filters.q ? 1 : 0);
  const groups = [
    { key: "category", label: "Category", options: CATEGORIES.map((c) => ({ value: c.slug, label: c.name })) },
    { key: "finish", label: "Finish", options: finishes },
    { key: "material", label: "Material", options: materials },
    { key: "application", label: "Application", options: applications },
  ];
  return (
    <div>
      <ListingBanner
        title={filters.q ? "Search results" : "All products"}
        description="Browse all RAWK handles, knobs, locks, hinges, drain jali and drain pipes. Preview items are marked and their specifications are to be confirmed from the catalogue sheet."
        crumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]}
      />
      <FilterBar
        groups={groups}
        values={values}
        sort={filters.sort}
        sortOptions={SORT_OPTIONS}
        activeCount={activeCount}
        search={{ value: filters.q, placeholder: "Title, SKU…" }}
        onValueChange={(key, value) => go({ [key]: toggleIn(filters[key as "category" | "finish" | "material" | "application"], value) } as Partial<FilterState>)}
        onClearAll={() => { scrollFlag.current = true; navigate("/products", { preventScrollReset: true }); }}
        onSearch={(q) => go({ q })}
        onApplyDraft={(draft, draftSort, searchQ) => { scrollFlag.current = true; navigate(`/products${filterQuery(filters, { category: draft.category ?? [], finish: draft.finish ?? [], material: draft.material ?? [], application: draft.application ?? [], sort: draftSort, q: searchQ ?? filters.q })}`, { preventScrollReset: true }); }}
      />
      <div ref={resultsRef} className="mx-auto w-full max-w-[1440px] scroll-mt-[160px] px-4 pb-40 pt-8 sm:px-[30px] lg:scroll-mt-[250px] lg:px-12 lg:pb-10">
        {filters.q ? (
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-navy sm:text-3xl">Results for &ldquo;{filters.q}&rdquo;</h2>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">Showing {products.length} of {total} products</p>
              <SortControl sort={filters.sort} sortOptions={SORT_OPTIONS} onSortChange={(value) => go({ sort: value })} />
            </div>
          </div>
        ) : (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Showing {products.length} of {total} products</p>
            <SortControl sort={filters.sort} sortOptions={SORT_OPTIONS} onSortChange={(value) => go({ sort: value })} />
          </div>
        )}
        {products.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-8 text-center">
            <h2 className="font-serif text-2xl text-navy">No matching products</h2>
            <p className="mt-2 text-muted">Try removing a filter, or ask the shop for help finding the right fitting.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link to="/products" className="flex min-h-11 items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white">Clear filters</Link>
              <a href={whatsappUrl("Hello, I could not find the hardware fitting I need. Can you help?")} target="_blank" rel="noreferrer" className="flex min-h-11 items-center rounded-lg bg-wa px-4 text-sm font-semibold text-white">Ask on WhatsApp</a>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((p) => (<ProductCard key={p.slug} p={p} />))}</div>
        )}
      </div>
    </div>
  );
}
