import { Link, useLoaderData, useNavigate, type MetaFunction } from "react-router";
import { listingLoader, filterQuery, type FilterState, type ListingData } from "../lib/listing";
import { canonical } from "../lib/seo";
import { CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import ListingBanner from "../components/ListingBanner";
import FilterBar, { type FilterValues } from "../components/FilterBar";
import { whatsappUrl } from "../lib/site";
export const loader = listingLoader;
export const meta: MetaFunction = () => [{ title: "All Products | RAWK" }, { name: "description", content: "Browse all RAWK handles, knobs, locks, hinges, drain jali and drain pipes. Filter by category, finish, material and application." }, { tagName: "link", rel: "canonical", href: canonical("/products") }];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name A–Z" },
];

export default function Products() {
  const { products, filters, finishes, materials, applications, total } = useLoaderData() as ListingData;
  const navigate = useNavigate();
  const go = (patch: Partial<FilterState>) => navigate(`/products${filterQuery(filters, patch)}`);
  const values: FilterValues = {
    category: filters.category, finish: filters.finish, material: filters.material, application: filters.application,
  };
  const activeCount = (["q", "category", "finish", "material", "application"] as const).filter((k) => filters[k]).length;
  const groups = [
    { key: "category", label: "Category", options: CATEGORIES.map((c) => ({ value: c.slug, label: c.name })) },
    { key: "finish", label: "Finish", options: finishes },
    { key: "material", label: "Material", options: materials },
    { key: "application", label: "Application", options: applications },
  ];
  return (
    <div>
      <ListingBanner
        title={filters.q ? `Results for "${filters.q}"` : "All products"}
        description="Browse all RAWK handles, knobs, locks, hinges, drain jali and drain pipes. Preview items are marked and their specifications are to be confirmed from the catalogue sheet."
        crumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]}
      />
      <FilterBar
        groups={groups}
        values={values}
        sort={filters.sort}
        sortOptions={SORT_OPTIONS}
        activeCount={activeCount}
        resultText={`${products.length} of ${total} products`}
        search={{ value: filters.q, placeholder: "Title, SKU…" }}
        onValueChange={(key, value) => go({ [key]: value } as Partial<FilterState>)}
        onSortChange={(value) => go({ sort: value })}
        onClearAll={() => navigate("/products")}
        onSearch={(q) => go({ q })}
        onApplyDraft={(draft, draftSort, searchQ) => navigate(`/products${filterQuery(filters, { ...draft, sort: draftSort, q: searchQ ?? filters.q })}`)}
      />
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-40 pt-8 sm:px-[30px] lg:px-12 lg:pb-10">
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
