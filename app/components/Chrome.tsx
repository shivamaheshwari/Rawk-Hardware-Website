import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Form, Link, NavLink, Outlet, useLocation } from "react-router";
import { BUSINESS, whatsappUrl } from "../lib/site";
import { CATEGORIES, PRODUCTS } from "../data/products";
import RawkButton from "./RawkButton";

export const EnquiryContext = createContext<{ message: string; setMessage: (m: string) => void }>({ message: "Hello, I would like to enquire about RAWK hardware products.", setMessage: () => {} });
export const useEnquiry = () => useContext(EnquiryContext);

// Logos: user-supplied Google Drive files. Black logo on the light header,
// white logo on the dark footer. If Drive ever fails to load, fall back to
// the text wordmark so the header never shows a broken image.
// Logos: the PNGs the user uploaded on 2026-10-25 are tried first; the
// Drive thumbnails are the fallback (binary PNGs cannot be pushed to
// GitHub via the snapshot API, so a GitHub-only deploy would miss them),
// then the text wordmark. Single font family site-wide: Lato.
// NOTE 2026-10-25: the logo file uploaded that day (1600x800, 2:1) is
// solid black with no visible artwork, so it was NOT swapped in; the
// existing black logo keeps running with the new sizing below.
const LOGO_BLACK = "https://drive.google.com/thumbnail?id=1g08wSEhpqE_LKLDndnMb_pei13XZDTRF&sz=w200";
const LOGO_WHITE = "https://drive.google.com/thumbnail?id=1poseI903UQVoSMTAvNZBtjLnBUFsryeJ&sz=w200";
function LogoImg({ local, drive, alt }: { local: string; drive: string; alt: string }) {
  const [stage, setStage] = useState(0);
  if (stage === 2) return <span className="font-serif text-[28px] font-bold tracking-wide text-navy">RAWK</span>;
  const src = stage === 0 ? local : drive;
  return <img src={src} alt={alt} className="aspect-[2/1] h-[50px] w-auto object-contain lg:h-[65px]" onError={() => setStage((v) => v + 1)} />;
}
function Wordmark() {
  return (<Link to="/" className="flex flex-col leading-none" aria-label="RAWK home">
    <LogoImg local="/images/rawk-logo-black.png" drive={LOGO_BLACK} alt="RAWK" />
  </Link>);
}
function FooterWordmark() {
  const [stage, setStage] = useState(0);
  if (stage === 2) return <p className="font-serif text-3xl font-bold">RAWK</p>;
  const src = stage === 0 ? "/images/rawk-logo-white.png" : LOGO_WHITE;
  return <img src={src} alt="RAWK" width={100} height={50} className="h-[50px] w-auto" onError={() => setStage((v) => v + 1)} />;
}

// Mega menu groups as specified by the user (2026-10-25). No group shows
// more than 6 items. Destinations reuse real catalogue pages only:
// Categories map to the matching application filter (Curtain has no
// catalogue data, so it falls back to all products); Collections map to
// the closest real category (drawer items, pulls and handles are all
// handle types in this catalogue; towel hangers to the bathroom filter);
// Best Sellers lists the first 6 featured products.
const MENU_CATEGORIES = [
  ["Door Accessories", "/products?application=Doors+%26+Gates"],
  ["Curtain Accessories", "/products"],
  ["Kitchen Accessories", "/products?application=Kitchen+Cabinets"],
  ["Bathroom Accessories", "/products?application=Bathroom+%26+Utility"],
] as const;
const MENU_COLLECTIONS = [
  ["Drawer items", "/categories/handles"],
  ["Pulls", "/categories/handles"],
  ["Locks", "/categories/locks"],
  ["Handles", "/categories/handles"],
  ["Towel hangers", "/products?application=Bathroom+%26+Utility"],
] as const;
const MENU_BEST_SELLERS = PRODUCTS.filter((p) => p.featured).slice(0, 6);

// Mobile sidebar accordion (user request 2026-10-26, test plan NAV-09/10):
// a section header with a plus/minus indicator; its children appear only
// while expanded, and tapping a child closes the whole drawer.
function MobileAccordion({ title, items, expanded, onToggle, onNavigate }: { title: string; items: readonly (readonly [string, string])[]; expanded: boolean; onToggle: () => void; onNavigate: () => void }) {
  return (<div className="border-b border-line">
    <button type="button" aria-expanded={expanded} onClick={onToggle} className="flex min-h-11 w-full items-center justify-between py-2 font-bold text-navy">
      {title}
      <img key={expanded ? "minus" : "plus"} src={expanded ? "/icons/minus.svg" : "/icons/plus.svg"} alt="" aria-hidden="true" width={14} height={14} className="h-3.5 w-3.5" />
    </button>
    {expanded && (<div className="pb-2">
      {items.map(([label, to]) => (<Link key={label} to={to} prefetch="intent" onClick={onNavigate} className="block min-h-11 content-center border-b border-line py-2 pl-4 font-bold text-navy last:border-0">{label}</Link>))}
    </div>)}
  </div>);
}
// Note: the mockup also lists "Curtain" under Categories, but no curtain
// product or application exists in the catalogue, so no Curtain link is
// invented here — it would lead nowhere real.

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const { pathname } = useLocation();
  const closeMobile = () => { setOpen(false); setMobileSection(null); };
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => document.documentElement.style.setProperty("--header-height", `${el.offsetHeight}px`);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    return () => { window.removeEventListener("resize", update); window.removeEventListener("load", update); };
  }, []);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);
  // Drawer lifecycle (test plan NAV-14/NAV-16, user request 2026-10-26):
  // close on route change (covers browser Back/Forward) and when the
  // viewport reaches desktop width (drawer is CSS-hidden there, so an
  // open state would otherwise leave the body scroll-locked with no
  // visible close control).
  useEffect(() => { closeMobile(); }, [pathname]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (mq.matches) closeMobile(); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  // Touch/tap fix (2026-10-25): a tap fires mouseenter then click within
  // milliseconds, so hover-open + click-toggle cancelled each other out and
  // the menu closed at once, leaving the plus icon. Clicks arriving within
  // 500ms of a hover-open are therefore ignored; a later tap still toggles.
  const megaHoverAt = useRef(0);
  const closeMega = () => { setMegaOpen(false); megaButtonRef.current?.focus(); };
  return (<><header ref={headerRef} onMouseLeave={() => setMegaOpen(false)} className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
    <div className="bg-navy px-4 py-2 text-center text-[13px] text-white">
      Hardware for every detail of your home.
    </div>
    <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 sm:px-[30px] lg:px-6 xl:px-12">
      <Wordmark />
      <button type="button" className="ml-auto flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-3 font-semibold text-navy transition-colors duration-300 hover:border-navy hover:bg-transparent lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}><img src="/icons/menu-alt-1.svg" alt="" aria-hidden="true" width={22} height={22} className="h-[22px] w-[22px]" /> Menu</button>
      <nav aria-label="Primary" className="hidden items-center gap-3 lg:flex xl:gap-6">
        <div>
          <button ref={megaButtonRef} type="button" aria-expanded={megaOpen} aria-haspopup="true" onMouseEnter={() => { megaHoverAt.current = Date.now(); setMegaOpen(true); }} onClick={() => { if (Date.now() - megaHoverAt.current < 500) return; setMegaOpen((v) => !v); }} onKeyDown={(e) => { if (e.key === "Escape") closeMega(); }} className="flex min-h-11 items-center gap-1 text-[15px] font-semibold text-navy">
            Collections <img key={megaOpen ? "minus" : "plus"} src={megaOpen ? "/icons/minus.svg" : "/icons/plus.svg"} alt="" aria-hidden="true" width={14} height={14} className="h-3.5 w-3.5" />
          </button>
        </div>
        <Link to="/#best-sellers" prefetch="intent" className="text-[15px] font-bold text-navy">Best Sellers</Link>
        <NavLink to="/about" prefetch="intent" className={({ isActive }) => `text-[15px] font-bold ${isActive ? "text-brass" : "text-navy"}`}>About Us</NavLink>
        <NavLink to="/contact" prefetch="intent" className={({ isActive }) => `text-[15px] font-bold ${isActive ? "text-brass" : "text-navy"}`}>Contact</NavLink>
      </nav>
      <div className="order-3 hidden w-full lg:order-none lg:ml-auto lg:block lg:w-auto">
        <Form method="get" action="/products" role="search" className="flex">
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input id="site-search" name="q" type="search" placeholder="Search handles, locks, hinges…" className="min-h-11 w-full min-w-0 rounded-l border border-line bg-white px-3 text-[15px] lg:w-36 xl:w-64" />
          <RawkButton variant="custom" type="submit" className="min-h-11 rounded-l-none rounded-r border border-navy bg-navy px-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent hover:text-navy">Search</RawkButton>
        </Form>
      </div>
      <RawkButton variant="custom" href="https://www.amazon.in/dp/B0GMD2D2JY" target="_blank" className="order-4 hidden min-h-11 items-center rounded-full border border-navy bg-navy px-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent hover:text-navy lg:inline-flex xl:px-5">Buy From Amazon</RawkButton>
      <RawkButton variant="custom" to="/contact" className="order-5 hidden min-h-11 items-center rounded-full border border-navy bg-navy px-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent hover:text-navy lg:inline-flex xl:px-5">Contact Us</RawkButton>
    </div>
    {megaOpen && (
      <div className="mega-menu absolute left-0 right-0 top-full z-50 hidden overflow-hidden border-b border-line bg-white shadow-xl lg:block" onKeyDown={(e) => { if (e.key === "Escape") closeMega(); }}>
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[130px] w-[320px] rounded-bl-full bg-brass" />
        <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-[auto_auto_auto_auto_280px] gap-6 px-6 pb-10 pt-10 xl:gap-10 xl:px-12">
          <div>
            <Link to="/products" prefetch="intent" onClick={() => setMegaOpen(false)} className="text-base font-bold uppercase tracking-wide text-navy hover:text-brass">Shop All Products</Link>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-navy">Categories</p>
            <ul className="mt-4 space-y-3">
              {MENU_CATEGORIES.map(([label, to]) => (<li key={label}><Link to={to} prefetch="intent" onClick={() => setMegaOpen(false)} className="text-[15px] text-navy hover:text-brass">{label}</Link></li>))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-navy">Collections</p>
            <ul className="mt-4 space-y-3">
              {MENU_COLLECTIONS.map(([label, to]) => (<li key={label}><Link to={to} prefetch="intent" onClick={() => setMegaOpen(false)} className="text-[15px] text-navy hover:text-brass">{label}</Link></li>))}
            </ul>
          </div>
          <div className="min-w-0 max-w-[240px]">
            <p className="text-sm font-bold uppercase tracking-wide text-navy">Best Sellers Products</p>
            <ul className="mt-4 space-y-3">
              {MENU_BEST_SELLERS.map((p) => (<li key={p.slug}><Link to={`/products/${p.slug}`} prefetch="intent" onClick={() => setMegaOpen(false)} title={p.title} className="block truncate text-[15px] text-navy hover:text-brass">{p.title}</Link></li>))}
            </ul>
          </div>
          <div className="relative flex flex-col items-center text-center">
            <div>
              <img src="/images/509-handle-overview.jpg" alt="RAWK 509 cabinet handle in Golden White" width={240} height={180} loading="lazy" className="h-[180px] w-[240px] object-cover" />
              <p className="mt-4 text-base font-bold text-navy">Connect with us ?</p>
              <p className="mx-auto mt-1 max-w-[240px] text-sm leading-relaxed text-muted">Quick support for product enquiries, bulk orders and project requirements.</p>
              <RawkButton variant="whatsapp" whatsappIcon href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" className="mt-4" onClick={() => setMegaOpen(false)}>WhatsApp Enquiry</RawkButton>
            </div>
          </div>
        </div>
        <svg aria-hidden className="block h-6 w-full text-ivory" preserveAspectRatio="none" viewBox="0 0 1440 24"><path d="M0,24 C240,0 480,0 720,12 C960,24 1200,24 1440,0 L1440,24 L0,24 Z" fill="currentColor" /></svg>
      </div>
    )}
  </header>
    {open && (
      <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
        <button type="button" aria-label="Close menu" onClick={closeMobile} className="absolute inset-0 h-full w-full bg-black/50" />
        <div id="mobile-menu" className="drawer-panel absolute right-0 top-0 flex h-full w-[320px] max-w-[85vw] flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-bold text-navy">Menu</span>
            <button type="button" onClick={closeMobile} aria-label="Close menu" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:border-navy hover:bg-transparent hover:text-navy"><img src="/icons/cross.svg" alt="" aria-hidden="true" width={18} height={18} className="h-[18px] w-[18px]" /></button>
          </div>
          {/* Mobile menu search (user request 2026-10-26): at the top of
              the drawer, above all menu items (Categories was removed in
              round 19, so this sits above Collections). Same search as
              the desktop header — submits to /products?q=… — and closes
              the drawer on submit. */}
          <Form method="get" action="/products" role="search" onSubmit={closeMobile} className="flex border-b border-line px-4 py-3">
            <label htmlFor="mobile-menu-search" className="sr-only">Search products</label>
            <input id="mobile-menu-search" name="q" type="search" placeholder="Search handles, locks, hinges…" className="min-h-11 w-full min-w-0 rounded-l border border-line bg-white px-3 text-[15px]" />
            <RawkButton variant="custom" type="submit" className="min-h-11 rounded-l-none rounded-r border border-navy bg-navy px-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent hover:text-navy">Search</RawkButton>
          </Form>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-3">
            {/* Mobile menu only (user request 2026-10-26, round 19):
                Categories is removed; order is Home, Collections,
                Company, Products, Best Products. Collections stays
                sorted A–Z; Company items are in the user's listed
                order. The shared CATEGORIES / MENU_COLLECTIONS order
                is NOT changed, so desktop mega menu, footer and
                category pages keep their existing order. All products
                and the old Best Sellers / Bulk Orders drawer links are
                replaced by Products and Best Products here. */}
            <Link to="/" prefetch="intent" onClick={closeMobile} className="block min-h-11 content-center border-b border-line py-2 font-bold text-navy">Home</Link>
            <MobileAccordion title="Collections" items={[...MENU_COLLECTIONS].sort((a, b) => a[0].localeCompare(b[0]))} expanded={mobileSection === "collections"} onToggle={() => setMobileSection(mobileSection === "collections" ? null : "collections")} onNavigate={closeMobile} />
            <MobileAccordion title="Company" items={[["About Us", "/about"], ["Catalogue", "/catalogue"], ["Contact Us", "/contact"], ["Guides", "/guides"]]} expanded={mobileSection === "company"} onToggle={() => setMobileSection(mobileSection === "company" ? null : "company")} onNavigate={closeMobile} />
            {[["Products", "/products"], ["Best Products", "/#best-sellers"]].map(([label, to]) => (
              <Link key={to} to={to} prefetch="intent" onClick={closeMobile} className="block min-h-11 content-center border-b border-line py-2 font-bold text-navy last:border-0">{label}</Link>))}
          </nav>
          <div className="flex flex-col gap-3 border-t border-line px-4 py-4">
            <RawkButton variant="custom" href="https://www.amazon.in/dp/B0GMD2D2JY" target="_blank" className="flex min-h-11 items-center justify-center rounded-full border border-navy bg-navy px-5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-transparent hover:text-navy">Buy From Amazon</RawkButton>
            <RawkButton variant="whatsapp" whatsappIcon href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" className="w-full">WhatsApp Enquiry</RawkButton>
          </div>
        </div>
      </div>
    )}
  </>);
}

// Footer link groups (user request 2026-10-26): on mobile they stay
// COLLAPSED until tapped, and the toggle uses the project's own
// plus/minus SVGs properly — plus when closed, minus when open. The
// SVGs are black strokes, so they are inverted to white on this dark
// footer. On desktop (lg+) the groups are always shown and the icon
// is hidden; resizing across the breakpoint re-syncs the state.
function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(() => typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setOpen(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return (
    <div className="border-b border-white/15 py-2 lg:border-0 lg:py-0">
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex w-full cursor-pointer items-center justify-between font-semibold lg:cursor-default">
        {title}
        <img key={open ? "minus" : "plus"} src={open ? "/icons/minus.svg" : "/icons/plus.svg"} alt="" aria-hidden="true" width={14} height={14} className="h-3.5 w-3.5 shrink-0 invert lg:hidden" />
      </button>
      <div className={open ? "mt-2" : "mt-2 hidden lg:block"}>{children}</div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (<footer className="bg-[#1d1c19] text-white">
    <div className="mx-auto grid w-full max-w-[1440px] gap-4 px-4 py-10 sm:px-[30px] lg:grid-cols-6 lg:gap-8 lg:px-12">
      <div>
        <FooterWordmark />
        <p className="mt-2 text-sm leading-relaxed text-white/70">Architectural hardware for modern living. Thoughtfully designed. Built to last.</p>
        <p className="mt-3 text-sm leading-relaxed text-white/80">{BUSINESS.businessName}<br />{BUSINESS.address}<br />Phone: {BUSINESS.phones.join(" / ")}<br />
          <a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">Instagram {BUSINESS.instagram}</a></p>
      </div>
      <FooterGroup title="Shop">
        <ul className="space-y-2 text-sm">{[["Home", "/"], ["All products", "/products"], ["Best Sellers", "/#best-sellers"], ["Bulk Orders", "/bulk-orders"], ["Catalogue", "/catalogue"], ["Guides", "/guides"], ["FAQs", "/#faqs"]].map(([l, to]) => (<li key={to}><Link className="text-white/80 hover:text-white hover:underline" to={to}>{l}</Link></li>))}</ul>
      </FooterGroup>
      <FooterGroup title="Categories">
        <ul className="space-y-2 text-sm">{CATEGORIES.map((c) => (<li key={c.slug}><Link className="text-white/80 hover:text-white hover:underline" to={`/categories/${c.slug}`}>{c.name}</Link></li>))}</ul>
        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-white/60">Accessories</p>
        <ul className="space-y-2 text-sm">{MENU_CATEGORIES.map(([l, to]) => (<li key={l}><Link className="text-white/80 hover:text-white hover:underline" to={to}>{l}</Link></li>))}</ul>
      </FooterGroup>
      <FooterGroup title="Collections">
        <ul className="space-y-2 text-sm">{MENU_COLLECTIONS.map(([l, to]) => (<li key={l}><Link className="text-white/80 hover:text-white hover:underline" to={to}>{l}</Link></li>))}</ul>
      </FooterGroup>
      <FooterGroup title="Company">
        <ul className="space-y-2 text-sm">{[["About Us", "/about"], ["Contact Us", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, to]) => (<li key={to}><Link className="text-white/80 hover:text-white hover:underline" to={to}>{l}</Link></li>))}</ul>
      </FooterGroup>
      <div>
        <h3 className="font-semibold">Get in Touch</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/80">Quick support for product enquiries, bulk orders and project requirements.</p>
        <RawkButton variant="whatsapp" whatsappIcon href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" className="mt-3">WhatsApp Enquiry</RawkButton>
      </div>
    </div>
    <div className="border-t border-white/15">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-4 px-4 py-6 sm:px-[30px] lg:flex-row lg:items-center lg:px-12">
        <p className="font-serif text-xl">Let&apos;s find the right hardware for your space.</p>
        <RawkButton to="/contact" variant="onDark" arrow>Talk to Our Team</RawkButton>
      </div>
      <p className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/60">© {year} RAWK. Product specifications shown are as supplied; preview items are marked and must be confirmed before launch.</p>
    </div>
  </footer>);
}

export function MobileBar() {
  const { pathname } = useLocation();
  const { message } = useEnquiry();
  const isProduct = pathname.startsWith("/products/");
  return (<div className="sticky bottom-0 z-[5] flex gap-[10px] border-t border-line bg-white p-4 sm:p-4 lg:px-[20px] lg:py-[30px] lg:hidden">
    <RawkButton variant="whatsapp" whatsappIcon href={whatsappUrl(message)} target="_blank" className="flex-1">{isProduct ? "Enquire about this product" : "WhatsApp"}</RawkButton>
    <RawkButton to="/bulk-orders" className="flex-1">Bulk Quote</RawkButton>
  </div>);
}

export default function Layout() {
  const [message, setMessage] = useState("Hello, I would like to enquire about RAWK hardware products.");
  return (<EnquiryContext.Provider value={{ message, setMessage }}>
    <div className="min-h-screen overflow-x-clip lg:pb-0">
      <Header /><main><Outlet /><MobileBar /></main><Footer />
    </div>
  </EnquiryContext.Provider>);
}
