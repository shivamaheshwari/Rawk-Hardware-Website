import { Link, type MetaFunction } from "react-router";
import { GUIDES } from "../data/guides";
import { canonical } from "../lib/seo";
import { Breadcrumbs } from "../components/Misc";
export const meta: MetaFunction = () => [{ title: "Buying Guides | RAWK" }, { name: "description", content: "Practical RAWK buying guides: handle hole spacing, hinge overlay, and drain jali sizing." }, { tagName: "link", rel: "canonical", href: canonical("/guides") }];
export default function Guides() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">Buying guides</h1>
    <div className="mt-6 grid gap-4 md:grid-cols-3">{GUIDES.map((g) => (<Link key={g.slug} to={`/guides/${g.slug}`} className="rounded-xl border border-line bg-white p-5">
      <h2 className="font-semibold text-navy">{g.title}</h2><p className="mt-1 text-sm text-muted">{g.excerpt}</p><span className="mt-3 block text-sm font-semibold text-brass">Read Guide →</span></Link>))}</div>
  </div>);
}
