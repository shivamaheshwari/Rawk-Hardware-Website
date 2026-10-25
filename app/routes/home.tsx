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

// FAQs (2026-10-25, user-supplied): 8 questions. The shop name
// "Vinayak Enterprises" appears once, in the section intro below; answers
// use RAWK / the shop after that. Minimum bulk order Rs 2,000 and the
// direct-purchase condition (packing video first, then payment) are the
// user's own terms. No other price, link or promise is invented here:
// Flipkart has no verified store link, so that answer routes to WhatsApp.
const FAQS = [
  { q: "What products does RAWK sell?", a: "Handles, knobs, locks, hinges, drain jali and drain pipes for doors, kitchens, bathrooms and wardrobes." },
  { q: "How can I contact you?", a: "Tap the WhatsApp Enquiry button anywhere on this site, call the shop, or use the Contact page. You can also find RAWK on Instagram at @rawk_04." },
  { q: "Can I buy from Amazon or Flipkart?", a: "Yes, on Amazon — our D2 Cabinet Handle (Rose Gold Black, 6-inch) is listed on Amazon India; use the Buy From Amazon button in the header. For Flipkart, message us on WhatsApp and we will share the correct listing link." },
  { q: "What is the minimum bulk order?", a: "Rs 2,000. For larger or project requirements, share product codes, quantities and your city on the Bulk Orders page." },
  { q: "How does direct purchase work?", a: "For a direct purchase, we will send you a video of your order being packed, and then you can send us the payment." },
  { q: "Where is your shop?", a: "Opposite UCO Bank, Daulatganj, Lashkar, Gwalior 474001. Call 9589133387 or 8962636662." },
  { q: "Why are some products marked Preview?", a: "Some catalogue items are marked Preview because their specifications are still to be confirmed from the catalogue sheet. Please ask the shop on WhatsApp to confirm the details before ordering." },
  { q: "How do I enquire for a bulk or project order?", a: "Go to the Bulk Orders page and share product codes, quantities and your city. The shop will confirm availability and share a tailored quote." },
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
        <button type="button" onClick={() => heroSwiper?.slidePrev()} aria-label="Previous slide" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:border-navy hover:bg-transparent"><img src="/icons/arrow-right-bold.svg" alt="" aria-hidden="true" width={18} height={18} className="h-[18px] w-[18px] rotate-180" /></button>
        <button type="button" onClick={() => heroSwiper?.slideNext()} aria-label="Next slide" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:border-navy hover:bg-transparent"><img src="/icons/arrow-right-bold.svg" alt="" aria-hidden="true" width={18} height={18} className="h-[18px] w-[18px]" /></button>
        <span className="text-sm font-medium tabular-nums text-muted" aria-live="polite">{String(heroIndex + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}</span>
        <div className="h-0.5 flex-1 overflow-hidden rounded bg-line" role="progressbar" aria-label="Slide autoplay progress" aria-valuenow={Math.round(heroProgress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div ref={progressRef} className="h-full bg-brass transition-[width] duration-200" style={{ width: `${Math.round(heroProgress * 100)}%` }} />
        </div>
        <button type="button" onClick={toggleHeroPause} aria-label={heroPaused ? "Play hero slider" : "Pause hero slider"} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:border-navy hover:bg-transparent">
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

    {/* 4 — Best sellers: swiper slider on every width (user request
        2026-10-25): 1.5 cards visible on mobile, 2.5 on tablet, 4 on
        desktop, one card per swipe step, all cards equal height. No grid
        and no Load More — swiping reveals all 20 best sellers. Note: a
        hard 300px card floor would shrink the mobile peek to ~1.2 cards
        (1.5 x 300px = 450px > a 360px phone screen), so card width comes
        from the fractional view instead: ~230px phones, ~270-370px
        tablets, ~300px+ desktop. */}
    <Section id="best-sellers" eyebrow="Best Sellers" title="Our Best Sellers" action={<RawkButton to="/products" variant="secondary">View all products</RawkButton>}>
      <RawkSwiper label="Best sellers" perView={{ mobile: 1.5, tablet: 2.5, desktop: 4 }} slidesPerGroup={1} spaceBetween={16} autoplay autoplayMs={4000} speed={700} loop usePagination showArrows={false} showDots={false} className="best-sellers-swiper">
        {bestsellers.map((p) => (<BestsellerCard key={p.slug} p={p} />))}
      </RawkSwiper>
    </Section>

    {/* 5 — Bulk-order banner */}
    <section className="w-full">
      <div className="grid overflow-hidden bg-[#1d1c19] text-white lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14">
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Big projects. Better partnerships.</h2>
          <p className="mt-3 max-w-md text-white/80">For dealers, retailers and project requirements.</p>
          <div className="mt-6">
            <RawkButton to="/bulk-orders" variant="custom" arrow className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-white px-5 text-sm font-semibold text-navy transition-all duration-300 hover:border-white hover:bg-transparent hover:text-white">Enquire for Bulk Orders</RawkButton>
          </div>
        </div>
        <div className="relative min-h-[310px] overflow-hidden lg:min-h-[340px]">
          <img src={bulkImage.images[0].src} alt={bulkImage.images[0].alt} width={800} height={600} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>

    {/* 6 — Testimonials (samples, explicitly labelled — see comment above) */}
    <Section eyebrow="Testimonials" title="What Our Customers Say" sub="Sample testimonials for UI review only — not real customer reviews. Replace with genuine reviews before release.">
      <RawkSwiper label="Testimonials" perView={{ mobile: 1, tablet: 2, desktop: 3 }} spaceBetween={16} autoplay autoplayMs={4000} speed={700} loop usePagination showArrows={false} showDots={false} className="testimonials-swiper">
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

    {/* 7 — FAQs */}
    <Section id="faqs" eyebrow="FAQs" title="Frequently Asked Questions" sub="Answers about ordering from Vinayak Enterprises (RAWK) — products, bulk orders and the shop.">
      <div className="rounded border border-line bg-white px-5">
        {FAQS.map((f) => (
          <details key={f.q} className="faq-item border-b border-line last:border-0">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 font-bold text-navy">
              {f.q}
              <img src="/icons/plus.svg" alt="" aria-hidden="true" width={16} height={16} className="faq-toggle h-4 w-4 shrink-0" />
            </summary>
            <p className="pb-4 leading-relaxed text-body">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>

    <section className="mx-auto w-full max-w-[1440px] px-4 pb-12 sm:px-[30px] lg:px-12">
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded border border-line">
          <iframe
            title="Vinayak Enterprises location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.857648564258!2d78.15121357487061!3d26.201308590301593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c5d25b2d979b%3A0x69dc3787508e1b35!2sVinayak%20Enterprise!5e0!3m2!1sen!2sin!4v1792952565320!5m2!1sen!2sin"
            className="h-[450px] w-full border-0 lg:h-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="rounded border border-line bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold text-navy">Visit our shop</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            <strong className="text-navy">{BUSINESS.businessName}</strong><br />{BUSINESS.address}
          </p>
          <p className="mt-3 text-sm text-muted">
            Phone: {BUSINESS.phones.map((phone, i) => (<span key={phone}>{i > 0 && " / "}<a className="underline" href={`tel:${phone}`}>{phone}</a></span>))}
          </p>
          <p className="mt-2 text-sm text-muted">
            Instagram: <a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">{BUSINESS.instagram}</a>
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <RawkButton variant="whatsapp" href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" rel="noreferrer">Enquire on WhatsApp</RawkButton>
            <RawkButton variant="secondary" href="https://www.google.com/maps/search/?api=1&query=26.201308590301593,78.15121357487061" target="_blank" rel="noreferrer">Get Directions</RawkButton>
          </div>
        </div>
      </div>
    </section>
  </>);
}
