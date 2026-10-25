import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, type LoaderFunction, type MetaFunction } from "react-router";
import { productBySlug, PRODUCTS, type Product } from "../data/products";
import { SITE_URL, enquiryDraft, whatsappUrl, FINISH_SWATCH } from "../lib/site";
import { canonical, breadcrumbJsonLd, productJsonLd } from "../lib/seo";
import ProductCard, { ProductImage } from "../components/ProductCard";
import { Breadcrumbs, Faq, JsonLd } from "../components/Misc";
import { useEnquiry } from "../components/Chrome";
import RawkButton from "../components/RawkButton";
export type ProductData = { p: Product };
export const loader: LoaderFunction = ({ params }): ProductData => {
  const p = productBySlug(params.slug ?? "");
  if (!p) throw new Response("Product not found", { status: 404 });
  return { p };
};
export const meta: MetaFunction = ({ data }) => { const d = data as ProductData | undefined; return d ? [
  { title: `${d.p.title} — ${d.p.variants[0]?.finish ?? ""} | RAWK` },
  { name: "description", content: d.p.description },
  { tagName: "link", rel: "canonical", href: canonical(`/products/${d.p.slug}`) }] : []; };
const fmt = (v: number | null | undefined) => (v === null || v === undefined ? "To be confirmed from sheet" : `${v} mm`);
export default function ProductPage() {
  const { p } = useLoaderData() as ProductData;
  const [finish, setFinish] = useState(p.finishes[0]);
  const sizes = useMemo(() => [...new Set(p.variants.filter((v) => v.finish === finish).map((v) => v.size_label))], [p, finish]);
  const [size, setSize] = useState(sizes[0]);
  useEffect(() => { setSize(sizes[0]); }, [finish, sizes]);
  const packs = useMemo(() => [...new Set(p.variants.filter((v) => v.finish === finish && v.size_label === size).map((v) => v.pack_count))], [p, finish, size]);
  const [pack, setPack] = useState(1);
  useEffect(() => { setPack(packs[0] ?? 1); }, [packs]);
  const variant = p.variants.find((v) => v.finish === finish && v.size_label === size && v.pack_count === pack) ?? p.variants.find((v) => v.finish === finish) ?? p.variants[0];
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const pageUrl = `${SITE_URL}/products/${p.slug}`;
  const wa = whatsappUrl(enquiryDraft({ title: p.title, sku: variant.sku, size: variant.size_label, finish: variant.finish, pack: variant.pack_count, qty, pageUrl }));
  const related = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const { setMessage } = useEnquiry();
  useEffect(() => {
    setMessage(enquiryDraft({ title: p.title, sku: variant.sku, size: variant.size_label, finish: variant.finish, pack: variant.pack_count, qty, pageUrl }));
    return () => setMessage("Hello, I would like to enquire about RAWK hardware products.");
  }, [p, variant, qty, pageUrl, setMessage]);
  const gallery = p.images.length > 0 ? p.images : [];
  return (<div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
    <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: p.title, path: `/products/${p.slug}` }])} />
    <JsonLd data={productJsonLd({ title: p.title, description: p.description, slug: p.slug, images: p.images.map((i) => i.src), category: p.category })} />
    <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: p.title, path: `/products/${p.slug}` }]} />
    <div className="mt-4 grid gap-8 lg:grid-cols-2">
      <div>
        {gallery.length > 0 ? (<>
          <div className="overflow-hidden rounded-xl border border-line bg-white">
            <img src={gallery[imgIdx].src} alt={gallery[imgIdx].alt} width={900} height={675} className="aspect-[4/3] w-full object-cover" />
          </div>
          {gallery.length > 1 && (<div className="mt-3 flex gap-2" role="group" aria-label="Product images">
            {gallery.map((g, i) => (<button key={g.src} type="button" onClick={() => setImgIdx(i)} aria-label={`Show image ${i + 1}: ${g.alt}`} aria-pressed={i === imgIdx} className={`overflow-hidden rounded-lg border-2 ${i === imgIdx ? "border-brass" : "border-line"}`}>
              <img src={g.src} alt="" width={120} height={90} loading="lazy" className="h-16 w-24 object-cover" />
            </button>))}
          </div>)}
        </>) : (<ProductImage p={p} eager />)}
      </div>
      <div>
        <h1 className="font-serif text-4xl leading-tight text-navy">{p.title}</h1>
        <p className="mt-2 text-sm text-muted">SKU: <strong className="text-body">{variant.sku}</strong> · {p.status === "preview" ? "Preview item — specifications to be confirmed from the catalogue sheet." : "Verified from the RAWK poster/photo for this product."}</p>
        <p className="mt-3 leading-relaxed text-body">{p.description}</p>
        <p className="mt-4 text-lg font-semibold text-navy">Request current price</p>
        <p className="text-sm text-muted">Price and availability are confirmed by the shop before any order. No price is shown because none has been approved for this listing.</p>
        <fieldset className="mt-5"><legend className="font-semibold text-navy">Finish</legend>
          <div className="mt-2 flex flex-wrap gap-2">{p.finishes.map((f) => {
            const disabled = !p.variants.some((v) => v.finish === f);
            return (<button key={f} type="button" disabled={disabled} onClick={() => setFinish(f)} aria-pressed={finish === f} className={`flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-semibold ${finish === f ? "border-brass bg-ivory ring-1 ring-brass" : "border-line bg-white"} disabled:opacity-40`}>
              <span className="h-4 w-4 rounded-full border border-line" style={{ background: FINISH_SWATCH[f] ?? "#ccc" }} />{f}{disabled ? " (unavailable)" : ""}</button>);
          })}</div></fieldset>
        <fieldset className="mt-4"><legend className="font-semibold text-navy">Size</legend>
          <div className="mt-2 flex flex-wrap gap-2">{sizes.map((s) => (<button key={s} type="button" onClick={() => setSize(s)} aria-pressed={size === s} className={`min-h-11 rounded-full border px-3 text-sm font-semibold ${size === s ? "border-brass bg-ivory ring-1 ring-brass" : "border-line bg-white"}`}>{s}</button>))}</div></fieldset>
        <fieldset className="mt-4"><legend className="font-semibold text-navy">Pack quantity</legend>
          <div className="mt-2 flex flex-wrap gap-2">{packs.map((pk) => (<button key={pk} type="button" onClick={() => setPack(pk)} aria-pressed={pack === pk} className={`min-h-11 rounded-full border px-3 text-sm font-semibold ${pack === pk ? "border-brass bg-ivory ring-1 ring-brass" : "border-line bg-white"}`}>Pack of {pk}</button>))}</div></fieldset>
        <label className="mt-4 block font-semibold text-navy">Quantity
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="mt-2 block min-h-11 w-32 rounded-lg border border-line bg-white px-3" /></label>
        <div className="mt-5 flex flex-wrap gap-3">
          <RawkButton variant="whatsapp" href={wa} target="_blank" className="flex-1 sm:flex-none sm:px-6">Enquire on WhatsApp</RawkButton>
          <RawkButton to={`/bulk-orders?sku=${encodeURIComponent(variant.sku)}&qty=${qty}`} className="flex-1 sm:flex-none sm:px-6">Request Quote</RawkButton>
          {variant.amazon_url && (<RawkButton variant="secondary" href={variant.amazon_url} target="_blank">View on Amazon ↗</RawkButton>)}
        </div>
        <p className="mt-2 text-xs text-muted">WhatsApp opens a draft message — you send it yourself. The Amazon button appears only for this verified listing.</p>
      </div>
    </div>
    <section className="mt-10"><h2 className="font-serif text-3xl text-navy">Specifications</h2>
      <dl className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
        {([["Category", p.category], ["Material", variant.material], ["Finish", variant.finish], ["Size", variant.size_label], ["Overall length", fmt(variant.overall_length_mm)], ["Hole-to-hole distance (mounting centres)", fmt(variant.mounting_centres_mm)], ["Pack quantity", `Pack of ${variant.pack_count}`], ["Package contents", variant.package_contents], ["Screws included", variant.screws_included], ...(variant.overlay_type ? [["Overlay type", variant.overlay_type] as const] : []), ...(variant.adjustment_type ? [["Adjustment type", variant.adjustment_type] as const] : []), ["Applications", p.applications.join(", ")] ] as [string, string][]).map(([k, v]) => (
          <div key={k} className="grid grid-cols-2 bg-white px-4 py-3"><dt className="text-sm font-medium text-muted">{k}</dt><dd className="text-sm text-body">{v}</dd></div>))}
      </dl>
      <p className="mt-2 text-sm text-muted">Overall length and hole-to-hole distance are different measurements — see the <Link className="underline" to="/guides/handle-hole-spacing-vs-overall-length">handle measurement guide</Link>.</p>
    </section>
    <section className="mt-10"><h2 className="font-serif text-3xl text-navy">Questions about this product</h2><div className="mt-4"><Faq items={[
      { q: `What is the SKU for this selection?`, a: `The selected variant is ${variant.sku} (${variant.size_label}, ${variant.finish}, pack of ${variant.pack_count}). The WhatsApp draft and quote form carry this SKU automatically.` },
      { q: "Are screws included?", a: variant.screws_included },
      { q: "How is price confirmed?", a: "Send the enquiry with the SKU and quantity. The shop confirms price and availability before any order — this site does not reserve stock." },
    ]} /></div></section>
    {related.length > 0 && (<section className="mt-10"><h2 className="font-serif text-3xl text-navy">Related products</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((r) => (<ProductCard key={r.slug} p={r} />))}</div></section>)}
  </div>);
}
