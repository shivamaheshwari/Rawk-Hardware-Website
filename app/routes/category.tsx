import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData, type LoaderFunction, type MetaFunction } from "react-router";
import type { Category, Product } from "../data/products";
import { categoryBySlug, filterProducts, productsByCategory } from "../data/products";
import { canonical, breadcrumbJsonLd } from "../lib/seo";
import ProductCard from "../components/ProductCard";
import { JsonLd } from "../components/Misc";
import ListingBanner from "../components/ListingBanner";
import FilterBar, { Pagination, SortControl, scrollToResults, type FilterValues } from "../components/FilterBar";
import { PAGE_SIZE } from "../lib/listing";
export type CategoryData = { cat: Category; products: Product[] };
export const loader: LoaderFunction = ({ params }): CategoryData => {
  const cat = categoryBySlug(params.slug ?? "");
  if (!cat) throw new Response("Category not found", { status: 404 });
  return { cat, products: productsByCategory(cat.slug) };
};
export const meta: MetaFunction = ({ data }) => { const d = data as CategoryData | undefined; return d ? [
  { title: `${d.cat.name} | RAWK` }, { name: "description", content: d.cat.description }, { tagName: "link", rel: "canonical", href: canonical(`/categories/${d.cat.slug}`) }] : []; };

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

const EMPTY_VALUES: FilterValues = { finish: [], material: [], application: [] };
const toggleIn = (arr: string[], value: string) => (arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

export default function Category() {
  const { cat, products } = useLoaderData() as CategoryData;
  const [values, setValues] = useState<FilterValues>({ ...EMPTY_VALUES });
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollFlag = useRef(false);
  const finishes = useMemo(() => [...new Set(products.flatMap((p) => p.finishes))].sort(), [products]);
  const materials = useMemo(() => [...new Set(products.flatMap((p) => p.variants.map((v) => v.material)))].sort(), [products]);
  const applications = useMemo(() => [...new Set(products.flatMap((p) => p.applications))].sort(), [products]);
  const filtered = useMemo(() => {
    const list = filterProducts(products, values);
    if (sort === "name") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "name-desc") return [...list].sort((a, b) => b.title.localeCompare(a.title));
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [products, values, sort]);
  // After a filter apply, scroll to the results (never back to the banner):
  // the top card row and the showing-result text land just below the
  // sticky header + filter bar, with a gap.
  useEffect(() => {
    if (scrollFlag.current) { scrollFlag.current = false; scrollToResults(resultsRef.current); }
  }, [filtered]);
  const activeCount = Object.values(values).reduce((n, arr) => n + arr.length, 0);
  const groups = [
    { key: "finish", label: "Finish", options: finishes },
    { key: "material", label: "Material", options: materials },
    { key: "application", label: "Application", options: applications },
  ];
  const clearAll = () => { scrollFlag.current = true; setValues({ ...EMPTY_VALUES }); setPage(1); };
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goPage = (n: number) => { scrollFlag.current = true; setPage(n); };
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: cat.name, path: `/categories/${cat.slug}` }])} />
      <ListingBanner
        title={cat.name}
        description={cat.description}
        image={cat.image}
        imageAlt={cat.imageAlt}
        crumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: cat.name, path: `/categories/${cat.slug}` }]}
      />
      <FilterBar
        groups={groups}
        values={values}
        sort={sort}
        sortOptions={SORT_OPTIONS}
        activeCount={activeCount}
        onValueChange={(key, value) => { scrollFlag.current = true; setPage(1); setValues((v) => ({ ...v, [key]: toggleIn(v[key] ?? [], value) })); }}
        onClearAll={clearAll}
        onApplyDraft={(draft, draftSort) => { scrollFlag.current = true; setPage(1); setValues({ finish: draft.finish ?? [], material: draft.material ?? [], application: draft.application ?? [] }); setSort(draftSort); }}
      />
      <div ref={resultsRef} className="mx-auto w-full max-w-[1440px] scroll-mt-[160px] px-4 pb-40 pt-8 sm:px-[30px] lg:scroll-mt-[250px] lg:px-12 lg:pb-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">Showing {paged.length} of {filtered.length} products</p>
          <SortControl sort={sort} sortOptions={SORT_OPTIONS} onSortChange={(value) => { scrollFlag.current = true; setPage(1); setSort(value); }} />
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-8 text-center">
            <h2 className="font-serif text-2xl text-navy">No matching products</h2>
            <p className="mt-2 text-muted">Try removing a filter in this category.</p>
            <button type="button" onClick={clearAll} className="mt-4 min-h-11 rounded-full border border-navy bg-navy px-4 text-sm font-semibold text-white transition-colors hover:bg-transparent hover:text-navy">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{paged.map((p) => (<ProductCard key={p.slug} p={p} mobileListing />))}</div>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={goPage} />
          </>
        )}
        <p className="mt-6"><Link to="/products" prefetch="intent" className="font-semibold text-navy underline">← All products</Link></p>
      </div>
    </div>
  );
}
