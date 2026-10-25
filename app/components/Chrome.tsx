import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { Form, Link, NavLink, Outlet, useLocation } from "react-router";
import { BUSINESS, whatsappUrl } from "../lib/site";
import { CATEGORIES } from "../data/products";
import RawkButton from "./RawkButton";

export const EnquiryContext = createContext<{ message: string; setMessage: (m: string) => void }>({ message: "Hello, I would like to enquire about RAWK hardware products.", setMessage: () => {} });
export const useEnquiry = () => useContext(EnquiryContext);

// No official logo file exists in public/ — the text wordmark is kept, as
// before, rather than redrawing the logo from the generated mockup.
function Wordmark() {
  return (<Link to="/" className="flex flex-col leading-none" aria-label="RAWK home">
    <span className="font-serif text-[28px] tracking-wide text-navy">RAWK</span>
    <span className="text-[11px] font-medium tracking-wide text-muted">Hardware by Vinayak Enterprise</span>
  </Link>);
}

const USE_AREAS = [
  ["Door", "/products?application=Doors+%26+Gates"],
  ["Kitchen", "/products?application=Kitchen+Cabinets"],
  ["Bathroom", "/products?application=Bathroom+%26+Utility"],
  ["Wardrobes", "/products?application=Wardrobes"],
] as const;
// Note: the mockup also lists "Curtain" under Categories, but no curtain
// product or application exists in the catalogue, so no Curtain link is
// invented here — it would lead nowhere real.

export function Header() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const closeMega = () => { setMegaOpen(false); megaButtonRef.current?.focus(); };
  return (<header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
    <div className="bg-navy px-4 py-2 text-center text-[13px] text-white">
      Hardware for every detail of your home.
    </div>
    <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8 lg:px-12">
      <Wordmark />
      <button type="button" className="ml-auto flex min-h-11 items-center gap-2 rounded border border-line bg-white px-3 font-medium text-navy lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>☰ Menu</button>
      <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
        <div onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)} className="relative">
          <button ref={megaButtonRef} type="button" aria-expanded={megaOpen} aria-haspopup="true" onClick={() => setMegaOpen(!megaOpen)} onKeyDown={(e) => { if (e.key === "Escape") closeMega(); }} className="flex min-h-11 items-center gap-1 text-[15px] font-medium text-navy">
            Collections <span aria-hidden>{megaOpen ? "▴" : "▾"}</span>
          </button>
          {megaOpen && (
            <div className="absolute left-0 top-full z-50 w-[560px] max-w-[90vw] rounded border border-line bg-white p-6 shadow-lg" onKeyDown={(e) => { if (e.key === "Escape") closeMega(); }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">By product type</p>
                  <ul className="mt-3 space-y-2">
                    {CATEGORIES.map((c) => (<li key={c.slug}><Link to={`/categories/${c.slug}`} onClick={() => setMegaOpen(false)} className="text-[15px] font-medium text-navy hover:text-brass">{c.name}</Link></li>))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">By use area</p>
                  <ul className="mt-3 space-y-2">
                    {USE_AREAS.map(([label, to]) => (<li key={label}><Link to={to} onClick={() => setMegaOpen(false)} className="text-[15px] font-medium text-navy hover:text-brass">{label}</Link></li>))}
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-4">
                <RawkButton to="/products" onClick={() => setMegaOpen(false)}>View all products</RawkButton>
                <RawkButton to="/bulk-orders" variant="secondary" onClick={() => setMegaOpen(false)}>Enquire for Bulk Orders</RawkButton>
              </div>
            </div>
          )}
        </div>
        <Link to="/#best-sellers" className="text-[15px] font-medium text-navy">Best Sellers</Link>
        <NavLink to="/about" className={({ isActive }) => `text-[15px] font-medium ${isActive ? "text-brass" : "text-navy"}`}>About Us</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `text-[15px] font-medium ${isActive ? "text-brass" : "text-navy"}`}>Contact</NavLink>
      </nav>
      <div className="order-3 w-full lg:order-none lg:ml-auto lg:w-auto">
        <Form method="get" action="/products" role="search" className="flex">
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input id="site-search" name="q" type="search" placeholder="Search handles, locks, hinges…" className="min-h-11 w-full min-w-0 rounded-l border border-line bg-white px-3 text-[15px] lg:w-64" />
          <RawkButton variant="custom" type="submit" className="min-h-11 rounded-l-none rounded-r border border-navy bg-navy px-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#33312e]">Search</RawkButton>
        </Form>
      </div>
      <RawkButton href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" className="order-4 hidden lg:inline-flex">WhatsApp Enquiry</RawkButton>
    </div>
    {open && (<nav id="mobile-menu" aria-label="Mobile" className="border-t border-line bg-white px-4 py-3 lg:hidden">
      <p className="py-2 text-xs font-semibold uppercase tracking-wide text-muted">Collections</p>
      {CATEGORIES.map((c) => (<Link key={c.slug} to={`/categories/${c.slug}`} onClick={() => setOpen(false)} className="block min-h-11 content-center border-b border-line py-2 font-medium text-navy">{c.name}</Link>))}
      {[["Best Sellers", "/#best-sellers"], ["All products", "/products"], ["About Us", "/about"], ["Bulk Orders", "/bulk-orders"], ["Guides", "/guides"], ["Contact", "/contact"], ["Catalogue", "/catalogue"]].map(([label, to]) => (
        <Link key={to} to={to} onClick={() => setOpen(false)} className="block min-h-11 content-center border-b border-line py-2 font-medium text-navy last:border-0">{label}</Link>))}
      <RawkButton href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" className="mt-3 w-full">WhatsApp Enquiry</RawkButton>
    </nav>)}
  </header>);
}

function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="footer-group border-b border-white/15 py-3 lg:border-0 lg:py-0">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold lg:cursor-default">
        {title}<span aria-hidden className="footer-chevron lg:hidden">▾</span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (<footer className="bg-[#1d1c19] text-white">
    <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-10 sm:px-8 lg:grid-cols-5 lg:px-12">
      <div>
        <p className="font-serif text-3xl">RAWK</p>
        <p className="mt-2 text-sm leading-relaxed text-white/70">Architectural hardware for modern living. Thoughtfully designed. Built to last.</p>
        <p className="mt-3 text-sm leading-relaxed text-white/80">{BUSINESS.businessName}<br />{BUSINESS.address}<br />Phone: {BUSINESS.phones.join(" / ")}<br />
          <a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">Instagram {BUSINESS.instagram}</a></p>
      </div>
      <FooterGroup title="Company">
        <ul className="space-y-2 text-sm">{[["About Us", "/about"], ["Contact Us", "/contact"], ["Catalogue", "/catalogue"], ["Guides", "/guides"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, to]) => (<li key={to}><Link className="text-white/80 hover:text-white hover:underline" to={to}>{l}</Link></li>))}</ul>
      </FooterGroup>
      <FooterGroup title="Categories">
        <ul className="space-y-2 text-sm">{USE_AREAS.map(([l, to]) => (<li key={l}><Link className="text-white/80 hover:text-white hover:underline" to={to}>{l}</Link></li>))}</ul>
      </FooterGroup>
      <FooterGroup title="Products">
        <ul className="space-y-2 text-sm">{[["Handles & Pulls", "/categories/handles"], ["Locks", "/categories/locks"], ["Hinges", "/categories/hinges"], ["Hooks & Knobs", "/categories/knobs"]].map(([l, to]) => (<li key={to}><Link className="text-white/80 hover:text-white hover:underline" to={to}>{l}</Link></li>))}</ul>
      </FooterGroup>
      <div>
        <h3 className="font-semibold">Get in Touch</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/80">Quick support for product enquiries, bulk orders and project requirements.</p>
        <RawkButton href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" className="mt-3">WhatsApp Enquiry</RawkButton>
      </div>
    </div>
    <div className="border-t border-white/15">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-4 px-4 py-6 sm:px-8 lg:flex-row lg:items-center lg:px-12">
        <p className="font-serif text-xl">Let&apos;s find the right hardware for your space.</p>
        <RawkButton to="/contact" variant="onDark" arrow>Talk to Our Team</RawkButton>
      </div>
      <p className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/60">© {year} RAWK — Hardware by Vinayak Enterprise. Product specifications shown are as supplied; preview items are marked and must be confirmed before launch.</p>
    </div>
  </footer>);
}

export function MobileBar() {
  const { pathname } = useLocation();
  const { message } = useEnquiry();
  const isProduct = pathname.startsWith("/products/");
  return (<div className="sticky bottom-0 z-40 flex gap-[10px] border-t border-line bg-white px-4 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden">
    <RawkButton variant="whatsapp" href={whatsappUrl(message)} target="_blank" className="flex-1">{isProduct ? "Enquire about this product" : "WhatsApp"}</RawkButton>
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
