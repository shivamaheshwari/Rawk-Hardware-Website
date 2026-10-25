import { Link } from "react-router";
import type { Product } from "../data/products";
import { FINISH_SWATCH } from "../lib/site";
import RawkButton from "./RawkButton";

export function ProductImage({ p, eager = false, contain = false, scaleOnHover = true }: { p: Product; eager?: boolean; contain?: boolean; scaleOnHover?: boolean }) {
  const img = p.images[0];
  if (!img) return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 bg-navy/90 px-4 text-center" role="img" aria-label={`Preview image for ${p.title} — photo to be added`}>
      <span className="font-serif text-2xl text-white">RAWK</span>
      <span className="text-xs font-medium text-white/80">{p.title}</span>
      <span className="text-[11px] text-white/60">Preview image — photo to be added</span>
    </div>);
  // Image hover: scale 1.1, then scale back, inside an overflow-hidden
  // wrapper (the wrapper lives in the card, not here, so this img can also
  // be reused standalone). Width/height reserve space to avoid layout shift.
  const hover = scaleOnHover ? "transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none" : "";
  return <img src={img.src} alt={img.alt} width={800} height={600} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} className={`aspect-[4/3] w-full ${hover} ${contain ? "object-contain bg-white" : "object-cover"}`} />;
}

export default function ProductCard({ p }: { p: Product }) {
  const first = p.variants[0];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded border border-line bg-white transition-shadow duration-300 hover:shadow-md">
      <Link to={`/products/${p.slug}`} prefetch="intent" aria-label={`View ${p.title}`} className="block overflow-hidden"><ProductImage p={p} /></Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug text-navy"><Link to={`/products/${p.slug}`} prefetch="intent">{p.title}</Link></h3>
          {p.status === "preview" && <span className="shrink-0 rounded-full bg-ivory px-2 py-0.5 text-[11px] font-medium text-muted">Preview</span>}
        </div>
        <p className="text-sm text-muted">{first?.material ?? "—"}{first?.mounting_centres_mm ? ` · ${first.mounting_centres_mm} mm centres` : ""}{first?.size_label && first.size_label !== "Size to be confirmed from sheet" ? ` · ${first.size_label}` : ""}</p>
        <div className="flex flex-wrap gap-1.5" aria-label="Finishes">
          {p.finishes.map((f) => (<span key={f} title={f} aria-label={f} className="h-5 w-5 rounded-full border border-line" style={{ background: FINISH_SWATCH[f] ?? "#ccc" }} />))}
        </div>
        <p className="text-sm font-medium text-navy">Request current price</p>
        <div className="mt-auto flex gap-2 pt-1">
          <RawkButton to={`/products/${p.slug}`} className="flex-1">View Details</RawkButton>
          <RawkButton to={`/bulk-orders?sku=${encodeURIComponent(first?.sku ?? "")}`} variant="secondary" className="flex-1">Ask for Quote</RawkButton>
        </div>
      </div>
    </article>);
}
