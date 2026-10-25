import { useMemo, useState } from "react";
import { Link, useLoaderData, type LoaderFunction, type MetaFunction } from "react-router";
import type { Category, Product } from "../data/products";
import { categoryBySlug, filterProducts, productsByCategory } from "../data/products";
import { canonical, breadcrumbJsonLd } from "../lib/seo";
import ProductCard from "../components/ProductCard";
import { JsonLd } from "../components/Misc";
import ListingBanner from "../components/ListingBanner";
import FilterBar, { type FilterValues } from "../components/FilterBar";
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
];

export default function Category() {
  const { cat, products } = useLoaderData() as CategoryData;
  const [values, setValues] = useState<FilterValues>({ finish: "", material: "", application: "" });
  const [sort, setSort] = useState("featured");
  const finishes = useMemo(() => [...new Set(products.flatMap((p) => p.finishes))].sort(), [products]);
  const materials = useMemo(() => [...new Set(products.flatMap((p) => p.variants.map((v) => v.material)))].sort(), [products]);
  const applications = useMemo(() => [...new Set(products.flatMap((p) => p.applications))].sort(), [products]);
  const filtered = useMemo(() => {
    const list = filterProducts(products, values);
    if (sort === "name") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [products, values, sort]);
  const activeCount = Object.values(values).filter(Boolean).length;
  const groups = [
    { key: "finish", label: "Finish", options: finishes },
    { key: "material", label: "Material", options: materials },
    { key: "application", label: "Application", options: applications },
  ];
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
        resultText={`${filtered.length} of ${products.length} products`}
        onValueChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
        onSortChange={setSort}
        onClearAll={() => setValues({ finish: "", material: "", application: "" })}
        onApplyDraft={(draft, draftSort) => { setValues({ finish: draft.finish ?? "", material: draft.material ?? "", application: draft.application ?? "" }); setSort(draftSort); }}
      />
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-40 pt-8 sm:px-[30px] lg:px-12 lg:pb-10">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-line bg-white p-8 text-center">
            <h2 className="font-serif text-2xl text-navy">No matching products</h2>
            <p className="mt-2 text-muted">Try removing a filter in this category.</p>
            <button type="button" onClick={() => setValues({ finish: "", material: "", application: "" })} className="mt-4 min-h-11 rounded-lg bg-navy px-4 text-sm font-semibold text-white">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((p) => (<ProductCard key={p.slug} p={p} />))}</div>
        )}
        <p className="mt-6"><Link to="/products" prefetch="intent" className="font-semibold text-navy underline">← All products</Link></p>
      </div>
    </div>
  );
}
