import { Link, useLoaderData, type LoaderFunction, type MetaFunction } from "react-router";
import type { Category, Product } from "../data/products";
import { categoryBySlug, productsByCategory } from "../data/products";
import { canonical, breadcrumbJsonLd } from "../lib/seo";
import ProductCard from "../components/ProductCard";
import { Breadcrumbs, JsonLd } from "../components/Misc";
export type CategoryData = { cat: Category; products: Product[] };
export const loader: LoaderFunction = ({ params }): CategoryData => {
  const cat = categoryBySlug(params.slug ?? "");
  if (!cat) throw new Response("Category not found", { status: 404 });
  return { cat, products: productsByCategory(cat.slug) };
};
export const meta: MetaFunction = ({ data }) => { const d = data as CategoryData | undefined; return d ? [
  { title: `${d.cat.name} | RAWK` }, { name: "description", content: d.cat.description }, { tagName: "link", rel: "canonical", href: canonical(`/categories/${d.cat.slug}`) }] : []; };
export default function Category() {
  const { cat, products } = useLoaderData() as CategoryData;
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: cat.name, path: `/categories/${cat.slug}` }])} />
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: cat.name, path: `/categories/${cat.slug}` }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">{cat.name}</h1>
    <p className="mt-1 text-muted">{cat.description} — {products.length} product{products.length === 1 ? "" : "s"}.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((p) => (<ProductCard key={p.slug} p={p} />))}</div>
    <p className="mt-6"><Link to="/products" className="font-semibold text-navy underline">← All products</Link></p>
  </div>);
}
