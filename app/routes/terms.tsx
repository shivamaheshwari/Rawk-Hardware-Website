import type { MetaFunction } from "react-router";
import { canonical } from "../lib/seo";
import { Breadcrumbs } from "../components/Misc";
export const meta: MetaFunction = () => [{ title: "Website Terms | RAWK" }, { name: "description", content: "Terms for using the RAWK catalogue website." }, { tagName: "link", rel: "canonical", href: canonical("/terms") }];
export default function Terms() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">Website Terms</h1>
    <div className="mt-4 max-w-3xl space-y-4 leading-relaxed text-body">
      <p>This website is a product catalogue and enquiry service. It does not sell products, reserve stock, confirm orders or accept payment online.</p>
      <p>Prices, availability, delivery and other terms are confirmed by Vinayak Enterprises privately before any order. Specifications shown as “to be confirmed” must be confirmed before ordering.</p>
      <p>Amazon listings linked from this site are operated by Amazon; their prices, availability and fulfilment terms are Amazon's. Product images are the business's own catalogue images; preview items are marked as such.</p>
      <p>This terms text is the site's working version and should be reviewed by the business before launch.</p>
    </div>
  </div>);
}
