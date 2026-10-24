import { createContext, useContext, useState, type ReactNode } from "react";
import { Form, Link, NavLink, Outlet, useLocation } from "react-router";
import { BUSINESS, whatsappUrl } from "../lib/site";
import { CATEGORIES } from "../data/products";
export const EnquiryContext = createContext<{ message: string; setMessage: (m: string) => void }>({ message: "Hello, I would like to enquire about RAWK hardware products.", setMessage: () => {} });
export const useEnquiry = () => useContext(EnquiryContext);
function Wordmark() {
  return (<Link to="/" className="flex flex-col leading-none" aria-label="RAWK home">
    <span className="font-serif text-[28px] tracking-wide text-navy">RAWK</span>
    <span className="text-[11px] font-medium tracking-wide text-muted">Hardware by Vinayak Enterprise</span>
  </Link>);
}
export function Header() {
  const [open, setOpen] = useState(false);
  const nav = [["Products", "/products"], ["Bulk Orders", "/bulk-orders"], ["Guides", "/guides"], ["Contact", "/contact"]];
  return (<header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur">
    <div className="bg-navy px-4 py-2 text-center text-[13px] text-white">
      <Link to="/bulk-orders" className="underline underline-offset-2">Retail enquiries • Dealer enquiries • Project requirements</Link>
    </div>
    <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
      <Wordmark />
      <button type="button" className="ml-auto flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 font-medium text-navy lg:hidden" aria-expanded={open} aria-label="Open menu" onClick={() => setOpen(!open)}>☰ Menu</button>
      <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
        {nav.map(([label, to]) => (<NavLink key={to} to={to} className={({ isActive }) => `text-[15px] font-medium ${isActive ? "text-brass" : "text-navy"}`}>{label}</NavLink>))}
      </nav>
      <div className="order-3 w-full lg:order-none lg:ml-auto lg:w-auto">
        <Form method="get" action="/products" role="search" className="flex">
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input id="site-search" name="q" type="search" placeholder="Search handles, locks, hinges…" className="min-h-11 w-full min-w-0 rounded-l-lg border border-line bg-white px-3 text-[15px] lg:w-64" />
          <button type="submit" className="min-h-11 rounded-r-lg bg-navy px-4 text-sm font-semibold text-white">Search</button>
        </Form>
      </div>
      <a href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" rel="noreferrer" className="order-4 hidden min-h-11 items-center rounded-lg bg-wa px-4 text-sm font-semibold text-white lg:flex">Enquire on WhatsApp</a>
    </div>
    {open && (<nav aria-label="Mobile" className="border-t border-line bg-white px-4 py-3 lg:hidden">
      {[...nav, ["About", "/about"], ["Catalogue", "/catalogue"], ["Privacy", "/privacy"]].map(([label, to]) => (
        <Link key={to} to={to} onClick={() => setOpen(false)} className="block min-h-11 content-center border-b border-line py-2 font-medium text-navy last:border-0">{label}</Link>))}
    </nav>)}
  </header>);
}
export function Footer() {
  return (<footer className="bg-navy text-white">
    <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
      <div><p className="font-serif text-3xl">RAWK</p><p className="text-sm text-white/70">Hardware by Vinayak Enterprise</p>
        <p className="mt-3 text-sm leading-relaxed text-white/80">{BUSINESS.businessName}<br />{BUSINESS.address}<br />Phone: {BUSINESS.phones.join(" / ")}<br /><a className="underline" href={BUSINESS.instagramUrl} target="_blank" rel="noreferrer">Instagram {BUSINESS.instagram}</a></p></div>
      <nav aria-label="Categories"><h3 className="font-semibold">Categories</h3><ul className="mt-3 space-y-2 text-sm">{CATEGORIES.map((c) => (<li key={c.slug}><Link className="text-white/80 underline-offset-2 hover:underline" to={`/categories/${c.slug}`}>{c.name}</Link></li>))}</ul></nav>
      <nav aria-label="Company"><h3 className="font-semibold">Company</h3><ul className="mt-3 space-y-2 text-sm">{[["About", "/about"], ["Bulk Orders", "/bulk-orders"], ["Catalogue", "/catalogue"], ["Guides", "/guides"], ["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([l, to]) => (<li key={to}><Link className="text-white/80 hover:underline" to={to}>{l}</Link></li>))}</ul></nav>
      <div><h3 className="font-semibold">Get in touch</h3><p className="mt-3 text-sm leading-relaxed text-white/80">Enquire on WhatsApp for price and availability — these are confirmed by the shop before any order. No website checkout or payment is offered.</p>
        <a href={whatsappUrl("Hello, I would like to enquire about RAWK hardware products.")} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-wa px-4 text-sm font-semibold text-white">Enquire on WhatsApp</a></div>
    </div>
    <p className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/60">© RAWK — Hardware by Vinayak Enterprise. Product specifications shown are as supplied; preview items are marked and must be confirmed before launch.</p>
  </footer>);
}
export function MobileBar() {
  const { pathname } = useLocation();
  const { message } = useEnquiry();
  const isProduct = pathname.startsWith("/products/");
  return (<div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-white px-4 pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden">
    <a href={whatsappUrl(message)} target="_blank" rel="noreferrer" className="flex min-h-12 flex-1 items-center justify-center rounded-lg bg-wa text-sm font-semibold text-white">{isProduct ? "Enquire about this product" : "WhatsApp"}</a>
    <Link to="/bulk-orders" className="flex min-h-12 flex-1 items-center justify-center rounded-lg bg-navy text-sm font-semibold text-white">Bulk Quote</Link>
  </div>);
}
export default function Layout() {
  const [message, setMessage] = useState("Hello, I would like to enquire about RAWK hardware products.");
  return (<EnquiryContext.Provider value={{ message, setMessage }}>
    <div className="min-h-screen overflow-x-clip pb-24 lg:pb-0">
      <Header /><main><Outlet /></main><Footer /><MobileBar />
    </div>
  </EnquiryContext.Provider>);
}
