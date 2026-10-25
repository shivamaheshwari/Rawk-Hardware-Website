import { useRef, useState } from "react";
import { Link, type MetaFunction } from "react-router";
import type { Swiper as SwiperType } from "swiper";
import { CATEGORIES, PRODUCTS, type Product } from "../data/products";
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
        <Heading className="mt-3 font-serif text-4xl leading-[1.05] text-navy sm:text-5xl lg:text-6xl">{slide.heading}</Heading>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">{slide.copy}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <RawkButton to={slide.cta.to} arrow>{slide.cta.label}</RawkButton>
          <RawkButton to={slide.secondary.to} variant="secondary">{slide.secondary.label}</RawkButton>
        </div>
      </div>
      <div className="group order-1 overflow-hidden lg:order-2">
        <Link to={`/products/${p.slug}`} aria-label={`View ${p.title}`}>
          <ProductImage p={p} eager={isFirst} />
        </Link>
      </div>
    </div>
  );
}

function BestsellerCard({ p }: { p: Product }) {
  const first = p.variants[0];
  const detail = [
    first?.material && first.material !== "To be confirmed from sheet" ? first.material : null,
    first?.size_label && first.size_label !== "Size to be confirmed from sheet" ? first.size_label : null,
    `${p.finishes.length} finish${p.finishes.length === 1 ? "" : "es"}`,
  ].filter(Boolean).join(" · ");
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded border border-line bg-white transition-shadow duration-300 hover:shadow-md">
      <Link to={`/products/${p.slug}`} aria-label={`View ${p.title}`} className="block overflow-hidden bg-white">
        <ProductImage p={p} contain />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-[15px] font-semibold leading-snug text-navy"><Link to={`/products/${p.slug}`}>{p.title}</Link></h3>
        {detail && <p className="text-sm text-muted">{detail}</p>}
        <p className="text-sm font-medium text-navy">Request current price</p>
        <div className="mt-auto pt-3">
          <RawkButton to={`/products/${p.slug}`} arrow className="w-full">View Product</RawkButton>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  // Bestsellers = featured products that actually have a real photo.
  // Preview-only featured rows (no photo) are not passed off as bestsellers.
  const bestsellers = PRODUCTS.filter((p) => p.featured && p.images.length > 0).slice(0, 5);
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
    <section aria-label="Featured hardware" className="mx-auto w-full max-w-[1440px] px-4 pt-6 sm:px-8 lg:px-12">
      <RawkSwiper
        label="Featured hardware"
        perView={{ mobile: 1, tablet: 1, desktop: 1 }}
        autoplay
        autoplayMs={6000}
        loop
        showArrows={false}
        showDots={false}
        paused={heroPaused}
        onSwiper={setHeroSwiper}
        onActiveChange={setHeroIndex}
        onAutoplayProgress={(progress) => setHeroProgress(1 - progress)}
      >
        {HERO_SLIDES.map((s, i) => (<HeroSlide key={s.slug} slide={s} isFirst={i === 0} />))}
      </RawkSwiper>
      <div className="mt-4 flex items-center gap-4">
        <button type="button" onClick={() => heroSwiper?.slidePrev()} aria-label="Previous slide" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white">←</button>
        <button type="button" onClick={() => heroSwiper?.slideNext()} aria-label="Next slide" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white">→</button>
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

    {/* 3 — Collections (the 6 real categories; no empty collection invented) */}
    <Section eyebrow="Collections" title="Explore Our Collections" action={<RawkButton to="/products" variant="secondary">View all collections</RawkButton>}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/categories/${c.slug}`} className="group overflow-hidden rounded border border-line bg-white transition-shadow duration-300 hover:shadow-md">
            <span className="block overflow-hidden">
              {c.image ? <img src={c.image} alt={c.imageAlt ?? c.name} width={400} height={300} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none" />
                : <span className="flex aspect-[4/3] items-center justify-center bg-ivory px-2 text-center text-sm font-semibold text-navy">{c.name}</span>}
            </span>
            <span className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-navy">{c.name}<span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span></span>
          </Link>
        ))}
      </div>
    </Section>

    {/* 4 — Best sellers */}
    <Section id="best-sellers" eyebrow="Best Sellers" title="Our Best Sellers" action={<RawkButton to="/products" variant="secondary">View all products</RawkButton>}>
      <RawkSwiper label="Best sellers" perView={{ mobile: 2, tablet: 2, desktop: 4 }} spaceBetween={16}>
        {bestsellers.map((p) => (<BestsellerCard key={p.slug} p={p} />))}
      </RawkSwiper>
    </Section>

    {/* 5 — Bulk-order banner */}
    <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="grid overflow-hidden rounded bg-[#1d1c19] text-white lg:grid-cols-2">
        <div className="px-6 py-10 sm:px-10 lg:py-14">
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Big projects. Better partnerships.</h2>
          <p className="mt-3 max-w-md text-white/80">For dealers, retailers and project requirements.</p>
          <div className="mt-6">
            <RawkButton to="/bulk-orders" variant="onDark" arrow>Enquire for Bulk Orders</RawkButton>
          </div>
        </div>
        <div className="group relative min-h-[240px] overflow-hidden">
          <img src={bulkImage.images[0].src} alt={bulkImage.images[0].alt} width={800} height={600} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none" />
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

    <section className="mx-auto w-full max-w-[1440px] px-4 pb-12 sm:px-8 lg:px-12">
      <div className="rounded border border-line bg-white p-5 text-sm text-muted">
        <strong className="text-navy">{BUSINESS.businessName}</strong> — {BUSINESS.address}. Phone: {BUSINESS.phones.join(" / ")}. Instagram: <a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">{BUSINESS.instagram}</a>. Enquire on WhatsApp: <a className="underline" href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" rel="noreferrer">message the shop</a>.
      </div>
    </section>
  </>);
}
