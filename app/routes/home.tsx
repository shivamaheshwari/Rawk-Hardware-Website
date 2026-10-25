import { useRef, useState } from "react";
import { Link, type MetaFunction } from "react-router";
import type { Swiper as SwiperType } from "swiper";
import { PRODUCTS, type Product } from "../data/products";
import { BUSINESS, whatsappUrl } from "../lib/site";
import { canonical, orgJsonLd, breadcrumbJsonLd } from "../lib/seo";
import { ProductImage } from "../components/ProductCard";
import RawkSwiper from "../components/RawkSwiper";
import RawkButton from "../components/RawkButton";
import MarketplaceMarquee from "../components/MarketplaceMarquee";
import { JsonLd, Section } from "../components/Misc";

export const meta: MetaFunction = () => [
  { title: "RAWK — Hardware for every detail | Vinayak Enterprises, Gwalior" },
  { name: "description", content: "Explore RAWK handles, knobs, locks, hinges, drain jali and drain pipes. Enquire on WhatsApp for price and availability." },
  { tagName: "link", rel: "canonical", href: canonical("/") },
];

// Hero slides: only products with a real photo and a real product page.
// Slide 1 carries the site's single H1; slides 2-3 use styled <p> headings.
const HERO_SLIDES = [
  {
    slug: "509-handle",
    eyebrow: "Architectural Hardware",
    heading: "Details that make a difference.",
    copy: "Beautifully designed hardware to elevate every space in your home.",
    cta: { label: "Explore Collections", to: "/products" },
    secondary: { label: "Bulk Enquiry", to: "/bulk-orders" },
  },
  {
    slug: "d2-cabinet-handle-rose-gold-black",
    eyebrow: "Architectural Hardware",
    heading: "D2 Cabinet Handle — Rose Gold Black",
    copy: "6-inch zinc cabinet handle, black with rose-gold accents, with fitting screws.",
    cta: { label: "View Product", to: "/products/d2-cabinet-handle-rose-gold-black" },
    secondary: { label: "Explore Collections", to: "/products" },
  },
  {
    slug: "curved-cabinet-handle",
    eyebrow: "Architectural Hardware",
    heading: "Curved Cabinet Handle",
    copy: "Premium zinc curved handle in five finishes, in 4, 6, 8 and 12 inch sizes.",
    cta: { label: "View Product", to: "/products/curved-cabinet-handle" },
    secondary: { label: "Explore Collections", to: "/products" },
  },
] as const;

// Testimonials: NO genuine customer reviews exist in this codebase, so these
// are explicitly labelled SAMPLES for UI review. They must be replaced with
// real, consented reviews (or removed) before any production release —
// they are never presented as real customers.
const SAMPLE_TESTIMONIALS = [
  { quote: "Great quality and elegant designs. The handles transformed our kitchen completely. Highly recommended!", name: "Customer name" },
  { quote: "Excellent finish and sturdy build. Exactly what we were looking for for our new home.", name: "Customer name" },
  { quote: "Professional service and beautiful products. We'll definitely be ordering again for our next project.", name: "Customer name" },
];

function HeroSlide({ slide, isFirst }: { slide: (typeof HERO_SLIDES)[number]; isFirst: boolean }) {
  const p = PRODUCTS.find((x) => x.slug === slide.slug)!;
  const Heading = isFirst ? "h1" : "p";
  return (
    <div className="grid bg-white lg:grid-cols-2">
      <div className="order-2 flex flex-col justify-center px-6 py-10 sm:px-10 lg:order-1 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">{slide.eyebrow}</p>
        <Heading className="mt-3 font-condensed text-4xl font-black leading-[1.05] text-navy sm:text-5xl lg:text-6xl">{slide.heading}</Heading>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">{slide.copy}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <RawkButton to={slide.cta.to} arrow>{slide.cta.label}</RawkButton>
          <RawkButton to={slide.secondary.to} variant="secondary">{slide.secondary.label}</RawkButton>
        </div>
      </div>
      <div className="order-1 overflow-hidden lg:order-2">
        <Link to={`/products/${p.slug}`} prefetch="intent" aria-label={`View ${p.title}`}>
          <ProductImage p={p} eager={isFirst} scaleOnHover={false} />
        </Link>
      </div>
    </div>
  );
}

function BestsellerCard({ p }: { p: Product }) {
  // Sizes: mounting-centre distances exactly as in the data, e.g.
  // "96 MM, 160 MM, 224 MM, 288 MM". Falls back to the variant size
  // labels when a product has no mounting-centre values (e.g. knobs).
  const centres = [...new Set(p.variants.map((v) => v.mounting_centres_mm).filter((v): v is number => v !== null))];
  const sizeText = centres.length > 0
    ? centres.map((c) => `${c} MM`).join(", ")
    : [...new Set(p.variants.map((v) => v.size_label))].filter((x) => !x.includes("to be confirmed")).join(", ");
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded border border-line bg-white transition-shadow duration-300 hover:shadow-md">
      <Link to={`/products/${p.slug}`} prefetch="intent" aria-label={`View ${p.title}`} className="block overflow-hidden bg-white">
        <ProductImage p={p} />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="truncate text-[15px] font-bold leading-snug text-navy"><Link to={`/products/${p.slug}`} prefetch="intent">{p.title}</Link></h3>
        {/* No review, rating or price exists in the product data, and none
            is invented: the card shows an honest "No reviews yet" and the
            enquiry price line until real values are supplied. */}
        <p className="text-sm text-muted" aria-label="No reviews yet">☆☆☆☆☆ · No reviews yet</p>
        {sizeText && <p className="text-sm text-muted">Sizes: {sizeText}</p>}
        <p className="text-sm font-bold text-navy">Price: Request current price</p>
        <div className="mt-auto pt-3">
          <RawkButton to={`/products/${p.slug}`} arrow className="w-full">View Product</RawkButton>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  // Bestsellers: first 20 products, so desktop shows 4 at a time and the
  // page dots are exactly 5 (20 / 4). Products without a real photo yet
  // show the labelled placeholder panel — never a fake photo.
  const bestsellers = PRODUCTS.slice(0, 20);
  const [visibleCount, setVisibleCount] = useState(6);
  const bulkImage = PRODUCTS.find((p) => p.slug === "509-handle")!;
  const [heroSwiper, setHeroSwiper] = useState<SwiperType | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const toggleHeroPause = () => {
    const next = !heroPaused;
    setHeroPaused(next);
    if (next) heroSwiper?.autoplay?.stop();
    else heroSwiper?.autoplay?.start();
  };

  return (<>
    <JsonLd data={orgJsonLd()} /><JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />

    {/* 1 — Hero slider */}
    <section aria-label="Featured hardware" className="w-full">
      <RawkSwiper
        label="Featured hardware"
        perView={{ mobile: 1, tablet: 1, desktop: 1 }}
        autoplay
        autoplayMs={5000}
        speed={400}
        loop
        showArrows={false}
        showDots={false}
        pauseOnHover={false}
        paused={heroPaused}
        onSwiper={setHeroSwiper}
        onActiveChange={setHeroIndex}
        onAutoplayProgress={(progress) => setHeroProgress(1 - progress)}
      >
        {HERO_SLIDES.map((s, i) => (<HeroSlide key={s.slug} slide={s} isFirst={i === 0} />))}
      </RawkSwiper>
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-4 pt-4 sm:px-[30px] lg:px-12">
        <button type="button" onClick={() => heroSwiper?.slidePrev()} aria-label="Previous slide" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white"><img src="/icons/arrow-right-bold.svg" alt="" aria-hidden="true" width={18} height={18} className="h-[18px] w-[18px] rotate-180" /></button>
        <button type="button" onClick={() => heroSwiper?.slideNext()} aria-label="Next slide" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white"><img src="/icons/arrow-right-bold.svg" alt="" aria-hidden="true" width={18} height={18} className="h-[18px] w-[18px]" /></button>
        <span className="text-sm font-medium tabular-nums text-muted" aria-live="polite">{String(heroIndex + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}</span>
        <div className="h-0.5 flex-1 overflow-hidden rounded bg-line" role="progressbar" aria-label="Slide autoplay progress" aria-valuenow={Math.round(heroProgress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div ref={progressRef} className="h-full bg-brass transition-[width] duration-200" style={{ width: `${Math.round(heroProgress * 100)}%` }} />
        </div>
        <button type="button" onClick={toggleHeroPause} aria-label={heroPaused ? "Play hero slider" : "Pause hero slider"} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white">
          {heroPaused ? "▶" : "❚❚"}
        </button>
      </div>
    </section>

    {/* 2 — Marketplace marquee */}
    <div className="mt-12 lg:mt-16"><MarketplaceMarquee /></div>

    {/* 3 — Collections: 8 tiles — 7 categories + View All as the last tile.
        Curtain has no curtain-specific application in the catalogue yet, so
        it links to all products until curtain data is added; every other
        tile links to a real category or use-area. Hooks & Knobs stays in
        the mega menu and footer Products list. */}
    <Section eyebrow="Collections" title="Explore Our Collections" action={<RawkButton to="/products" variant="secondary">View all collections</RawkButton>}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { name: "Handles & Pulls", to: "/categories/handles", image: "/images/509-handle-overview.jpg", alt: "RAWK 509 cabinet handle in Golden White" },
          { name: "Locks", to: "/categories/locks", image: null, alt: "" },
          { name: "Hinges", to: "/categories/hinges", image: null, alt: "" },
          { name: "Door Accessories", to: "/products?application=Doors+%26+Gates", image: null, alt: "" },
          { name: "Curtain Accessories", to: "/products", image: null, alt: "" },
          { name: "Kitchen Accessories", to: "/products?application=Kitchen+Cabinets", image: null, alt: "" },
          { name: "Bathroom Accessories", to: "/products?application=Bathroom+%26+Utility", image: null, alt: "" },
        ].map((c) => (
          <Link key={c.name} to={c.to} prefetch="intent" className="group overflow-hidden rounded border border-line bg-white transition-shadow duration-300 hover:shadow-md">
            <span className="block overflow-hidden">
              {c.image ? <img src={c.image} alt={c.alt} width={400} height={300} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none" />
                : <span className="flex aspect-[4/3] items-center justify-center bg-ivory px-2 text-center text-sm font-bold text-navy">{c.name}</span>}
            </span>
            <span className="flex items-center justify-between px-4 py-3 text-sm font-bold text-navy">{c.name}<img src="/icons/arrow-right-bold.svg" alt="" aria-hidden="true" width={16} height={16} className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" /></span>
          </Link>
        ))}
        <Link to="/products" prefetch="intent" className="group overflow-hidden rounded border border-navy bg-white transition-shadow duration-300 hover:shadow-md">
          <span className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-navy px-2 text-center text-white">
            <img src="/icons/arrow-right-bold.svg" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 invert transition-transform duration-300 group-hover:translate-x-1" />
            <span className="text-sm font-bold">Explore the full catalogue</span>
          </span>
          <span className="flex items-center justify-between px-4 py-3 text-sm font-bold text-navy">View All<img src="/icons/arrow-right-bold.svg" alt="" aria-hidden="true" width={16} height={16} className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" /></span>
        </Link>
      </div>
    </Section>

    {/* 4 — Best sellers: desktop slider (4 at a time, 1s smooth autoplay,
        arrows removed, page dots only) + tablet/mobile grid with Load More. */}
    <Section id="best-sellers" eyebrow="Best Sellers" title="Our Best Sellers" action={<RawkButton to="/products" variant="secondary">View all products</RawkButton>}>
      <div className="hidden lg:block">
        <RawkSwiper label="Best sellers" perView={{ mobile: 4, tablet: 4, desktop: 4 }} spaceBetween={16} autoplay autoplayMs={4000} speed={700} loop usePagination showArrows={false} showDots={false}>
          {bestsellers.map((p) => (<BestsellerCard key={p.slug} p={p} />))}
        </RawkSwiper>
      </div>
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-4">
          {bestsellers.slice(0, visibleCount).map((p) => (<BestsellerCard key={p.slug} p={p} />))}
        </div>
        {visibleCount < bestsellers.length && (
          <div className="mt-6 flex justify-center">
            <RawkButton onClick={() => setVisibleCount((v) => Math.min(bestsellers.length, v + 4))}>Load More</RawkButton>
          </div>
        )}
      </div>
    </Section>

    {/* 5 — Bulk-order banner */}
    <section className="w-full">
      <div className="grid overflow-hidden bg-[#1d1c19] text-white lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14">
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Big projects. Better partnerships.</h2>
          <p className="mt-3 max-w-md text-white/80">For dealers, retailers and project requirements.</p>
          <div className="mt-6">
            <RawkButton to="/bulk-orders" variant="custom" arrow className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-transparent bg-white px-5 text-sm font-bold text-navy transition-all duration-300 hover:border-white hover:bg-transparent hover:text-white">Enquire for Bulk Orders</RawkButton>
          </div>
        </div>
        <div className="relative min-h-[310px] overflow-hidden lg:min-h-[340px]">
          <img src={bulkImage.images[0].src} alt={bulkImage.images[0].alt} width={800} height={600} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>

    {/* 6 — Testimonials (samples, explicitly labelled — see comment above) */}
    <Section eyebrow="Testimonials" title="What Our Customers Say" sub="Sample testimonials for UI review only — not real customer reviews. Replace with genuine reviews before release.">
      <RawkSwiper label="Testimonials" perView={{ mobile: 1, tablet: 2, desktop: 3 }} spaceBetween={16}>
        {SAMPLE_TESTIMONIALS.map((t, i) => (
          <article key={i} className="flex h-full flex-col rounded border border-line bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-brass">Sample</p>
            <p aria-label="Rated 5 out of 5 stars" className="mt-2 text-brass">★★★★★</p>
            <p className="mt-3 flex-1 leading-relaxed text-body">“{t.quote}”</p>
            <p className="mt-4 text-sm font-semibold text-navy">{t.name}</p>
          </article>
        ))}
      </RawkSwiper>
    </Section>

    <section className="mx-auto w-full max-w-[1440px] px-4 pb-12 sm:px-[30px] lg:px-12">
      <div className="rounded border border-line bg-white p-5 text-sm text-muted">
        <strong className="text-navy">{BUSINESS.businessName}</strong> — {BUSINESS.address}. Phone: {BUSINESS.phones.join(" / ")}. Instagram: <a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">{BUSINESS.instagram}</a>. Enquire on WhatsApp: <a className="underline" href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" rel="noreferrer">message the shop</a>.
      </div>
    </section>
  </>);
}
