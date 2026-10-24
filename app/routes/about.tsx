import type { MetaFunction } from "react-router";
import { canonical } from "../lib/seo";
import { Breadcrumbs } from "../components/Misc";
import { BUSINESS } from "../lib/site";
export const meta: MetaFunction = () => [{ title: "About RAWK | Vinayak Enterprises, Gwalior" }, { name: "description", content: "RAWK hardware by Vinayak Enterprises, Gwalior — handles, knobs, locks, hinges, drain jali and drain pipes." }, { tagName: "link", rel: "canonical", href: canonical("/about") }];
export default function About() {
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
    <h1 className="mt-3 font-serif text-4xl text-navy">About RAWK</h1>
    <p className="mt-3 max-w-2xl leading-relaxed text-body">RAWK is the hardware brand of {BUSINESS.businessName}, based in Gwalior. The catalogue covers handles, knobs, locks, hinges, drain jali and drain pipes for homes, stores and projects. Retail buyers, dealers, designers, carpenters and contractors can enquire on WhatsApp or through the bulk form.</p>
    <p className="mt-3 max-w-2xl leading-relaxed text-body">This site is a catalogue and enquiry site only. It does not sell, reserve stock or take payment online. Price, availability and terms are confirmed by the shop before any order. Products are also listed on Amazon, Flipkart and JioMart; only verified Amazon links are shown, per product.</p>
    <div className="mt-6 rounded-xl border border-line bg-white p-5"><p className="text-body"><strong className="text-navy">{BUSINESS.businessName}</strong><br />{BUSINESS.address}<br />Phone: {BUSINESS.phones.join(" / ")}</p></div>
  </div>);
}
