import { Link, type MetaFunction } from "react-router";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { GUIDES } from "../data/guides";
import { BUSINESS, whatsappUrl } from "../lib/site";
import { canonical, orgJsonLd, breadcrumbJsonLd } from "../lib/seo";
import ProductCard, { ProductImage } from "../components/ProductCard";
import Slider from "../components/Slider";
import { Faq, JsonLd, Section } from "../components/Misc";
export const meta: MetaFunction = () => [
  { title: "RAWK — Hardware for every detail | Vinayak Enterprises, Gwalior" },
  { name: "description", content: "Explore RAWK handles, knobs, locks, hinges, drain jali and drain pipes. Enquire on WhatsApp for price and availability." },
  { tagName: "link", rel: "canonical", href: canonical("/") },
];
const FINISHES = ["Golden White", "Black White", "Rose Gold White", "Satin White", "Rose Gold Black"];
const APPS = [
  { name: "Kitchen Cabinets", to: "/products?application=Kitchen+Cabinets", note: "Everyday fittings for functional kitchens." },
  { name: "Wardrobes", to: "/products?application=Wardrobes", note: "Handles, locks and hinges for organised spaces." },
  { name: "Doors & Gates", to: "/products?application=Doors+%26+Gates", note: "Locks and hinges for doors." },
  { name: "Bathroom & Utility", to: "/products?application=Bathroom+%26+Utility", note: "Drain jali and pipes for clean, reliable spaces." },
];
export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  const handle509 = PRODUCTS.find((p) => p.slug === "509-handle")!;
  return (<>
    <JsonLd data={orgJsonLd()} /><JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
    <section className="mx-auto w-full max-w-[1200px] px-4 pt-6 sm:px-8">
      <div className="grid items-center gap-6 rounded-2xl bg-white p-6 sm:grid-cols-2 lg:p-10">
        <div>
          <h1 className="font-serif text-[38px] leading-[1.05] text-navy sm:text-6xl">Hardware for every detail.</h1>
          <p className="mt-4 text-lg text-body">Explore handles, locks, hinges and everyday fittings for your home, store or project.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/products" className="flex min-h-12 items-center rounded-lg bg-brass px-5 font-semibold text-white">Explore Products →</Link>
            <a href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" rel="noreferrer" className="flex min-h-12 items-center rounded-lg border border-line bg-white px-5 font-semibold text-navy">Enquire on WhatsApp</a>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl"><ProductImage p={handle509} eager /></div>
      </div>
    </section>
    <Section title="Browse by category" sub="Six categories, one catalogue.">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (<Link key={c.slug} to={`/categories/${c.slug}`} className="overflow-hidden rounded-xl border border-line bg-white">
          {c.image ? <img src={c.image} alt={c.imageAlt ?? c.name} width={400} height={300} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            : <div className="flex aspect-[4/3] items-center justify-center bg-navy px-2 text-center text-sm font-semibold text-white">{c.name}</div>}
          <span className="block px-3 py-3 text-center text-sm font-semibold text-navy">{c.name} <span className="block text-xs font-normal text-muted">Explore →</span></span>
        </Link>))}
      </div>
    </Section>
    <Section title="Featured products" sub="Explore the collection." action={<Link to="/products" className="shrink-0 text-sm font-semibold text-navy underline">View all products →</Link>}>
      <Slider label="Featured products">{featured.map((p) => (<ProductCard key={p.slug} p={p} />))}</Slider>
    </Section>
    <Section title="Find your finish" sub="Clicking a finish shows products available in it. Not every product comes in every finish.">
      <Slider label="Finishes" perView={{ mobile: 2, tablet: 3, desktop: 5 }}>
        {FINISHES.map((f) => (<Link key={f} to={`/products?finish=${encodeURIComponent(f)}`} className="block overflow-hidden rounded-xl border border-line bg-white p-4 text-center">
          <span className="mx-auto block h-14 w-14 rounded-full border border-line" style={{ background: f === "Golden White" ? "linear-gradient(135deg,#B38A48 50%,#fff 50%)" : f === "Black White" ? "linear-gradient(135deg,#111 50%,#fff 50%)" : f === "Rose Gold White" ? "linear-gradient(135deg,#c98a7a 50%,#fff 50%)" : f === "Rose Gold Black" ? "linear-gradient(135deg,#c98a7a 50%,#111 50%)" : "#e8e8e8" }} />
          <span className="mt-3 block font-semibold text-navy">{f}</span><span className="text-xs text-muted">Shop this finish →</span>
        </Link>))}
      </Slider>
    </Section>
    <Section title="Shop by application">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {APPS.map((a) => (<Link key={a.name} to={a.to} className="rounded-xl border border-line bg-white p-5">
          <span className="font-semibold text-navy">{a.name}</span><span className="mt-1 block text-sm text-muted">{a.note}</span><span className="mt-3 block text-sm font-semibold text-brass">Browse →</span>
        </Link>))}
      </div>
    </Section>
    <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-8"><div className="rounded-2xl bg-navy px-6 py-10 text-white sm:px-10">
      <h2 className="font-serif text-3xl sm:text-4xl">Buying for a project or your store?</h2>
      <p className="mt-2 max-w-xl text-white/80">Share product codes, quantities and your city. Request availability and a tailored quote.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/bulk-orders" className="flex min-h-12 items-center rounded-lg bg-brass px-5 font-semibold text-white">Request Bulk Quote →</Link>
        <a href={whatsappUrl("Hello, I would like to discuss a bulk / project order for RAWK hardware.")} target="_blank" rel="noreferrer" className="flex min-h-12 items-center rounded-lg border border-white/40 px-5 font-semibold text-white">Discuss on WhatsApp</a>
      </div></div></section>
    <Section title="Product information and support">
      <div className="grid gap-3 md:grid-cols-3">
        {[["Clear product specifications", "Overall length and hole-to-hole spacing are shown separately, with SKU, finish, size and pack for every variant."], ["Help choosing sizes and finishes", "Read the buying guides, or send your measurements on WhatsApp and the shop will help you match them."], ["Retail and bulk enquiries", "Retail buyers, dealers, designers, carpenters and contractors can enquire on WhatsApp or through the bulk form."]].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-line bg-white p-5"><h3 className="font-semibold text-navy">{t}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{d}</p></div>))}
      </div>
    </Section>
    <Section title="Buying guides" action={<Link to="/guides" className="text-sm font-semibold text-navy underline">View all guides →</Link>}>
      <div className="grid gap-3 md:grid-cols-3">{GUIDES.map((g) => (<Link key={g.slug} to={`/guides/${g.slug}`} className="rounded-xl border border-line bg-white p-5">
        <h3 className="font-semibold text-navy">{g.title}</h3><p className="mt-1 text-sm text-muted">{g.excerpt}</p><span className="mt-3 block text-sm font-semibold text-brass">Read Guide →</span></Link>))}</div>
    </Section>
    <Section title="Frequently asked questions">
      <Faq items={[
        { q: "How do I enquire about a product?", a: "Open the product page, choose size, finish and pack, then tap “Enquire on WhatsApp”. A draft message with the product, SKU and quantity is prepared for you — you send it yourself. You can also use the bulk or contact form." },
        { q: "Can I request bulk quantities?", a: "Yes. Use the Bulk Orders page with product codes, quantities and your city. The shop confirms price and availability before any order." },
        { q: "Where do I find dimensions?", a: "On each product page, in the specification table. Overall length and hole-to-hole (mounting-centre) distance are separate rows. Unknown values are shown as “to be confirmed”, not estimated." },
        { q: "Are screws included?", a: "Only where the product page says so. For most preview items this is still to be confirmed from the catalogue sheet." },
        { q: "Can I buy on Amazon?", a: "Only where a verified Amazon listing is mapped to that exact product — the “View on Amazon” button appears only then. Price and fulfilment on Amazon are determined by Amazon." },
        { q: "Are all finishes available in every size?", a: "No. Variant controls disable combinations that do not exist, so you can only enquire about a combination that is listed." },
      ]} />
    </Section>
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-6 sm:px-8"><div className="rounded-xl border border-line bg-white p-5 text-sm text-muted">
      <strong className="text-navy">{BUSINESS.businessName}</strong> — {BUSINESS.address}. Phone: {BUSINESS.phones.join(" / ")}. Instagram: <a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">{BUSINESS.instagram}</a>.
    </div></section>
  </>);
}
