import { MARKETPLACES } from "../lib/site";
import RawkSwiper from "./RawkSwiper";

/**
 * Marketplace / social slider — a real Swiper loop (not a CSS marquee):
 * 3 logos on mobile, 4 on tablet, 6 on desktop, looping with autoplay that
 * keeps running on hover. Logos are the official PNGs from the user's
 * public Drive "Marquee Slider" folder, served via Drive thumbnails
 * (transparent backgrounds, as supplied). Only verified destinations are
 * links — Flipkart / Meesho / JioMart render as plain images, never as
 * invented URLs. If a Drive thumbnail ever fails, the brand name text
 * shows instead, so the slider never shows a broken image.
 */
const LOGO_IDS: Record<string, string> = {
  amazon: "1VrWTn3b3FU9eDNCj2ofuiroW-EknlA8M",
  Flipkart: "1gO6Y5MvaAqHanhx8uWrM78ORQIIkYP1K",
  meesho: "1KwF4JnFOOVoVSoW0feQQAP7Ow84hq0yx",
  JioMart: "1CM_xSrG3rr4Ldo9EZqfOidGdkG6fYZAO",
  WhatsApp: "1JLCZyxCsMRiJfnfkihwluLjjGJPSygx0",
  Instagram: "19MDZWRV6quP85n_ZXalwpF1ne_D1BXpo",
};

function LogoImage({ name }: { name: string }) {
  const id = LOGO_IDS[name];
  if (!id) return <span className="font-semibold">{name}</span>;
  return (
    <img
      src={`https://drive.google.com/thumbnail?id=${id}&sz=w400`}
      alt={name === "amazon" ? "Amazon" : name}
      width={160}
      height={44}
      loading="lazy"
      className="h-11 w-auto max-w-[160px] object-contain"
      onError={(e) => {
        const img = e.currentTarget;
        img.style.display = "none";
        const fallback = img.nextElementSibling as HTMLElement | null;
        if (fallback) fallback.style.display = "inline";
      }}
    />
  );
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
              <span className="flex min-h-11 items-center justify-center whitespace-nowrap text-navy">
                <LogoImage name={m.name} />
                <span style={{ display: "none" }} className="text-lg font-semibold">{m.name === "amazon" ? "Amazon" : m.name}</span>
              </span>
            );
            return m.url ? (
              <a key={m.name} href={m.url} target="_blank" rel="noreferrer" title={m.note} aria-label={m.name === "amazon" ? "Amazon" : m.name} className="transition-opacity duration-300 hover:opacity-70">
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
