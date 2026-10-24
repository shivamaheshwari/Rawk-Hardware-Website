import { Link } from "react-router";
import type { Product } from "../data/products";
import { FINISH_SWATCH } from "../lib/site";
export function ProductImage({ p, eager = false }: { p: Product; eager?: boolean }) {
  const img = p.images[0];
  if (!img) return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 bg-navy/90 px-4 text-center" role="img" aria-label={`Preview image for ${p.title} — photo to be added`}>
      <span className="font-serif text-2xl text-white">RAWK</span>
      <span className="text-xs font-medium text-white/80">{p.title}</span>
      <span className="text-[11px] text-white/60">Preview image — photo to be added</span>
    </div>);
  return <img src={img.src} alt={img.alt} width={800} height={600} loading={eager ? "eager" : "lazy"} className="aspect-[4/3] w-full object-cover" />;
}
export default function ProductCard({ p }: { p: Product }) {
  const first = p.variants[0];
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white">
      <Link to={`/products/${p.slug}`} aria-label={`View ${p.title}`}><ProductImage p={p} /></Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug text-navy"><Link to={`/products/${p.slug}`}>{p.title}</Link></h3>
          {p.status === "preview" && <span className="shrink-0 rounded-full bg-ivory px-2 py-0.5 text-[11px] font-medium text-muted">Preview</span>}
        </div>
        <p className="text-sm text-muted">{first?.material ?? "—"}{first?.mounting_centres_mm ? ` · ${first.mounting_centres_mm} mm centres` : ""}{first?.size_label && first.size_label !== "Size to be confirmed from sheet" ? ` · ${first.size_label}` : ""}</p>
        <div className="flex flex-wrap gap-1.5" aria-label="Finishes">
          {p.finishes.map((f) => (<span key={f} title={f} aria-label={f} className="h-5 w-5 rounded-full border border-line" style={{ background: FINISH_SWATCH[f] ?? "#ccc" }} />))}
        </div>
        <p className="text-sm font-medium text-navy">Request current price</p>
        <div className="mt-auto flex gap-2 pt-1">
          <Link to={`/products/${p.slug}`} className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-navy px-3 text-sm font-semibold text-white">View Details</Link>
          <Link to={`/bulk-orders?sku=${encodeURIComponent(first?.sku ?? "")}`} className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-navy px-3 text-sm font-semibold text-navy">Ask for Quote</Link>
        </div>
      </div>
    </article>);
}
