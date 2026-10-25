import { Link } from "react-router";
import type { Product } from "../data/products";
import { FINISH_SWATCH } from "../lib/site";
import RawkButton from "./RawkButton";

export function ProductImage({ p, eager = false, contain = false, scaleOnHover = true, fill = false }: { p: Product; eager?: boolean; contain?: boolean; scaleOnHover?: boolean; fill?: boolean }) {
  const img = p.images[0];
  if (!img) return (
    <div className={`flex w-full flex-col items-center justify-center gap-1 bg-navy/90 px-4 text-center ${fill ? "h-full sm:aspect-[4/3] sm:h-auto" : "aspect-[4/3]"}`} role="img" aria-label={`Preview image for ${p.title} — photo to be added`}>
      <span className="font-serif text-2xl text-white">RAWK</span>
      <span className="text-xs font-medium text-white/80">{p.title}</span>
      <span className="text-[11px] text-white/60">Preview image — photo to be added</span>
    </div>);
  // Image hover: scale 1.1, then scale back, inside an overflow-hidden
  // wrapper (the wrapper lives in the card, not here, so this img can also
  // be reused standalone). Width/height reserve space to avoid layout shift.
  // fill (mobile listing cards, user request 2026-10-26): the image covers
  // its whole 40% column — full width AND full card height, cropped with
  // object-cover — instead of the 4:3 box. On tablet/desktop it returns
  // to the 4:3 box.
  const hover = scaleOnHover ? "transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none" : "";
  const sizing = fill ? "h-full w-full object-cover sm:aspect-[4/3] sm:h-auto" : `aspect-[4/3] w-full ${contain ? "object-contain bg-white" : "object-cover"}`;
  return <img src={img.src} alt={img.alt} width={800} height={600} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} className={`${sizing} ${hover}`} />;
}

// Dummy reviews (user request 2026-10-26, listing cards only): the shop
// has no real ratings yet, so each card shows a stable dummy rating
// derived from the product slug (same product always shows the same
// dummy value). These MUST be replaced with real ratings before launch
// and must never be presented as genuine customer reviews.
function dummyReview(p: Product): { rating: string; stars: string; count: number } {
  let h = 0;
  for (let i = 0; i < p.slug.length; i++) h = (h * 31 + p.slug.charCodeAt(i)) % 1000;
  const rating = 4.0 + (h % 9) / 10;
  const filled = Math.round(rating);
  return { rating: rating.toFixed(1), stars: "★".repeat(filled) + "☆".repeat(5 - filled), count: 25 + (h % 226) };
}

// mobileListing (user request 2026-10-26, /products + /categories pages
// only): on mobile the card is a full-width horizontal row — image on
// the left, title + a single "View Item" button on the right, no
// delivery / wishlist / sponsored text (this site never had those).
// Round 25 had two such cards per row; round 26 changed the grid to one
// card per row on mobile, with a wider image. Round 27 made the mobile
// card bigger with a 40% image / 60% content split, a dummy reviews row
// and a price line above the View Item button. On tablet and desktop it
// renders exactly like the standard card above.
export default function ProductCard({ p, mobileListing = false }: { p: Product; mobileListing?: boolean }) {
  const first = p.variants[0];
  if (!mobileListing) return (
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
  const rev = dummyReview(p);
  return (
    <article className="group flex h-full flex-row overflow-hidden rounded border border-line bg-white transition-shadow duration-300 hover:shadow-md sm:flex-col">
      <Link to={`/products/${p.slug}`} prefetch="intent" aria-label={`View ${p.title}`} className="block w-[40%] shrink-0 overflow-hidden sm:w-full"><ProductImage p={p} scaleOnHover={false} fill /></Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:gap-2 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-3 text-[15px] font-semibold leading-snug text-navy sm:line-clamp-none"><Link to={`/products/${p.slug}`} prefetch="intent">{p.title}</Link></h3>
          {p.status === "preview" && <span className="hidden shrink-0 rounded-full bg-ivory px-2 py-0.5 text-[11px] font-medium text-muted sm:inline-block">Preview</span>}
        </div>
        <p className="text-sm leading-snug" aria-label={`Dummy rating ${rev.rating} out of 5`}><span className="text-brass" aria-hidden="true">{rev.stars}</span> <span className="font-medium text-navy">{rev.rating}</span> <span className="text-muted">({rev.count})</span></p>
        <p className="hidden text-sm text-muted sm:block">{first?.material ?? "—"}{first?.mounting_centres_mm ? ` · ${first.mounting_centres_mm} mm centres` : ""}{first?.size_label && first.size_label !== "Size to be confirmed from sheet" ? ` · ${first.size_label}` : ""}</p>
        <div className="hidden flex-wrap gap-1.5 sm:flex" aria-label="Finishes">
          {p.finishes.map((f) => (<span key={f} title={f} aria-label={f} className="h-5 w-5 rounded-full border border-line" style={{ background: FINISH_SWATCH[f] ?? "#ccc" }} />))}
        </div>
        <p className="text-sm font-medium text-navy">Request current price</p>
        <div className="mt-auto pt-1 sm:hidden">
          <RawkButton variant="custom" to={`/products/${p.slug}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-navy bg-navy px-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent hover:text-navy">View Item</RawkButton>
        </div>
        <div className="mt-auto hidden gap-2 pt-1 sm:flex">
          <RawkButton to={`/products/${p.slug}`} className="flex-1">View Details</RawkButton>
          <RawkButton to={`/bulk-orders?sku=${encodeURIComponent(first?.sku ?? "")}`} variant="secondary" className="flex-1">Ask for Quote</RawkButton>
        </div>
      </div>
    </article>);
}
