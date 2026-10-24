import { Link, useLoaderData, type LoaderFunction, type MetaFunction } from "react-router";
import { guideBySlug } from "../data/guides";
import { productBySlug } from "../data/products";
import { canonical, breadcrumbJsonLd } from "../lib/seo";
import { Breadcrumbs, JsonLd } from "../components/Misc";
import ProductCard from "../components/ProductCard";
export type GuideData = { g: import("../data/guides").Guide };
export const loader: LoaderFunction = ({ params }): GuideData => {
  const g = guideBySlug(params.slug ?? "");
  if (!g) throw new Response("Guide not found", { status: 404 });
  return { g };
};
export const meta: MetaFunction = ({ data }) => { const d = data as GuideData | undefined; return d ? [{ title: `${d.g.title} | RAWK` }, { name: "description", content: d.g.excerpt }, { tagName: "link", rel: "canonical", href: canonical(`/guides/${d.g.slug}`) }] : []; };
export default function GuidePage() {
  const { g } = useLoaderData() as GuideData;
  const related = g.related.map((s) => productBySlug(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }])} />
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]} />
    <h1 className="mt-3 max-w-3xl font-serif text-4xl text-navy">{g.title}</h1>
    <p className="mt-2 text-sm text-muted">Updated {g.updated}</p>
    <div className="mt-5 max-w-3xl space-y-4">{g.body.map((para, i) => (<p key={i} className="leading-relaxed text-body">{para}</p>))}</div>
    {related.length > 0 && (<section className="mt-10"><h2 className="font-serif text-3xl text-navy">Related products</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => (<ProductCard key={r.slug} p={r} />))}</div></section>)}
    <p className="mt-6"><Link to="/guides" className="font-semibold text-navy underline">← All guides</Link></p>
  </div>);
}
