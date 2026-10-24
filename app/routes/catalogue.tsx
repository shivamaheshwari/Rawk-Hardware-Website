import { Link, type MetaFunction } from "react-router";
import { canonical } from "../lib/seo";
import { Breadcrumbs } from "../components/Misc";
import { whatsappUrl } from "../lib/site";
export const meta: MetaFunction = () => [{ title: "Catalogue | RAWK" }, { name: "description", content: "The RAWK catalogue PDF is pending approval. Request it on WhatsApp or through the contact form." }, { tagName: "link", rel: "canonical", href: canonical("/catalogue") }];
export default function Catalogue() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Catalogue", path: "/catalogue" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">Catalogue</h1>
    <div className="mt-4 rounded-xl border border-line bg-white p-6">
      <p className="text-body">The approved RAWK catalogue PDF is not published yet. No dummy document is offered here — a placeholder download would be misleading.</p>
      <p className="mt-2 text-body">To request the catalogue, message the shop or use the contact form and mention “catalogue request”.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={whatsappUrl("Hello, please share the RAWK hardware catalogue.")} target="_blank" rel="noreferrer" className="flex min-h-12 items-center rounded-lg bg-wa px-5 font-semibold text-white">Request on WhatsApp</a>
        <Link to="/contact" className="flex min-h-12 items-center rounded-lg bg-navy px-5 font-semibold text-white">Contact form</Link>
      </div>
    </div>
  </div>);
}
