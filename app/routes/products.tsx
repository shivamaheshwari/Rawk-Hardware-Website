import { Form, Link, useLoaderData, useSubmit, type MetaFunction } from "react-router";
import { listingLoader, filterQuery, type FilterState, type ListingData } from "../lib/listing";
import { canonical } from "../lib/seo";
import ProductCard from "../components/ProductCard";
import { Breadcrumbs } from "../components/Misc";
import { whatsappUrl } from "../lib/site";
export const loader = listingLoader;
export const meta: MetaFunction = () => [{ title: "All Products | RAWK" }, { name: "description", content: "Browse all RAWK handles, knobs, locks, hinges, drain jali and drain pipes. Filter by category, finish, material and application." }, { tagName: "link", rel: "canonical", href: canonical("/products") }];
function Field({ label, name, value, options }: { label: string; name: keyof FilterState; value: string; options: string[] }) {
  return (<label className="block text-sm font-medium text-navy">{label}
    <select name={name} defaultValue={value} className="mt-1 min-h-11 w-full rounded-lg border border-line bg-white px-2">
      <option value="">All</option>{options.map((o) => (<option key={o} value={o}>{o}</option>))}
    </select></label>);
}
export default function Products() {
  const { products, filters, finishes, materials, applications, total } = useLoaderData() as ListingData;
  const submit = useSubmit();
  const active = (Object.keys(filters) as (keyof FilterState)[]).filter((k) => k !== "sort" && filters[k]);
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">All products</h1>
    <p className="mt-1 text-muted">{products.length} of {total} products. Preview items are marked and their specifications are to be confirmed from the catalogue sheet.</p>
    <Form method="get" onChange={(e) => submit(e.currentTarget)} className="mt-6 rounded-xl border border-line bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <label className="block text-sm font-medium text-navy">Search
          <input name="q" defaultValue={filters.q} placeholder="Title, SKU…" className="mt-1 min-h-11 w-full rounded-lg border border-line px-2" /></label>
        <Field label="Category" name="category" value={filters.category} options={["handles", "knobs", "locks", "hinges", "drain-jali", "drain-pipes"]} />
        <Field label="Finish" name="finish" value={filters.finish} options={finishes} />
        <Field label="Material" name="material" value={filters.material} options={materials} />
        <Field label="Application" name="application" value={filters.application} options={applications} />
        <label className="block text-sm font-medium text-navy">Sort
          <select name="sort" defaultValue={filters.sort} className="mt-1 min-h-11 w-full rounded-lg border border-line bg-white px-2">
            <option value="featured">Featured</option><option value="name">Name A–Z</option>
          </select></label>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="submit" className="min-h-11 rounded-lg bg-navy px-4 text-sm font-semibold text-white">Apply filters</button>
        {active.length > 0 && (<>
          <span className="text-sm text-muted">Active:</span>
          {active.map((k) => (<Link key={k} to={`/products${filterQuery(filters, { [k]: "" } as Partial<FilterState>)}`} className="rounded-full border border-line bg-ivory px-3 py-1 text-xs font-medium">{k}: {filters[k]} ✕</Link>))}
          <Link to="/products" className="text-sm font-semibold text-navy underline">Clear filters</Link>
        </>)}
      </div>
    </Form>
    {products.length === 0 ? (
      <div className="mt-8 rounded-xl border border-line bg-white p-8 text-center">
        <h2 className="font-serif text-2xl text-navy">No matching products</h2>
        <p className="mt-2 text-muted">Try removing a filter, or ask the shop for help finding the right fitting.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/products" className="flex min-h-11 items-center rounded-lg bg-navy px-4 text-sm font-semibold text-white">Clear filters</Link>
          <a href={whatsappUrl("Hello, I could not find the hardware fitting I need. Can you help?")} target="_blank" rel="noreferrer" className="flex min-h-11 items-center rounded-lg bg-wa px-4 text-sm font-semibold text-white">Ask on WhatsApp</a>
        </div>
      </div>
    ) : (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((p) => (<ProductCard key={p.slug} p={p} />))}</div>
    )}
  </div>);
}
