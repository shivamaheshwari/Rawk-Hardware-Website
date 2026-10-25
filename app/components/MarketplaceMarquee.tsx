import { MARKETPLACES } from "../lib/site";
import RawkSwiper from "./RawkSwiper";

/**
 * Marketplace / social slider — a real Swiper loop (not a CSS marquee):
 * 3 logos on mobile, 4 on tablet, 6 on desktop, looping with autoplay that
 * keeps running on hover. Only verified destinations are links — Flipkart /
 * Meesho / JioMart render as plain text, never as invented URLs.
 * NOTE: the user-supplied Drive "Marquee Slider" folder holds the official
 * logo PNGs; they will replace these text wordmarks once the folder's file
 * IDs are confirmed (browser lookup still running), via Drive thumbnail
 * URLs — the folder link itself is not a logo URL.
 */
function LogoWordmark({ name }: { name: string }) {
  if (name === "amazon") return <span className="font-bold lowercase tracking-tight">amazon <span aria-hidden className="text-brass">⌄</span></span>;
  if (name === "Flipkart") return <span className="font-bold italic text-[#2874f0]">Flipkart</span>;
  if (name === "meesho") return <span className="font-bold lowercase text-[#570d57]">meesho</span>;
  if (name === "JioMart") return <span className="font-bold text-[#0078ad]">JioMart</span>;
  if (name === "WhatsApp") return <span className="font-semibold text-[#176b42]">WhatsApp</span>;
  return <span className="font-semibold">Instagram</span>;
}

export default function MarketplaceMarquee() {
  return (
    <section aria-label="Shop RAWK on your favourite platform" className="border-y border-line bg-white py-8">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-[30px] lg:px-12">
        <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">Shop RAWK on your favourite platform</h2>
        <p className="mt-1 text-sm text-muted">Shop online or connect with us.</p>
      </div>
      <div className="mx-auto mt-6 w-full max-w-[1440px] px-4 sm:px-[30px] lg:px-12">
        <RawkSwiper
          label="Marketplace logos"
          perView={{ mobile: 3, tablet: 4, desktop: 6 }}
          spaceBetween={24}
          autoplay
          autoplayMs={2000}
          speed={1000}
          loop
          pauseOnHover={false}
          showArrows={false}
          showDots={false}
        >
          {MARKETPLACES.map((m) => {
            const content = (
              <span className="flex min-h-11 items-center justify-center whitespace-nowrap text-lg text-navy">
                <LogoWordmark name={m.name} />
              </span>
            );
            return m.url ? (
              <a key={m.name} href={m.url} target="_blank" rel="noreferrer" title={m.note} aria-label={m.name} className="transition-opacity duration-300 hover:opacity-70">
                {content}
              </a>
            ) : (
              <span key={m.name} title={m.note} className="cursor-default">
                {content}
              </span>
            );
          })}
        </RawkSwiper>
      </div>
    </section>
  );
}
