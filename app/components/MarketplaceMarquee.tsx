import { useState } from "react";
import { MARKETPLACES } from "../lib/site";
import RawkSwiper from "./RawkSwiper";

/**
 * Marketplace / social slider — a real Swiper loop (not a CSS marquee):
 * 3 logos on mobile, 4 on tablet, 6 on desktop, looping with autoplay that
 * NEVER stops on interaction: pauseOnHover is false, Swiper's
 * disableOnInteraction is false, and there is no pause button. Logos are
 * the PNG files the user uploaded on 2026-10-25 (public/images/marquee/),
 * in the user's order: Amazon, Flipkart, JioMart, Meesho, WhatsApp,
 * Instagram. If a local file is missing (e.g. a deploy built from GitHub
 * alone, where binary PNGs cannot be pushed via the snapshot API), the
 * Drive thumbnail of the same logo is tried, then the brand name text —
 * so the slider never shows a broken image.
 * Only verified destinations are links — Flipkart / Meesho / JioMart
 * render as plain images, never as invented URLs.
 */
const LOGO_FILES: Record<string, string> = {
  amazon: "amazon",
  Flipkart: "flipkart",
  JioMart: "jiomart",
  meesho: "meesho",
  WhatsApp: "whatsapp",
  Instagram: "instagram",
};
const LOGO_DRIVE_IDS: Record<string, string> = {
  amazon: "1VrWTn3b3FU9eDNCj2ofuiroW-EknlA8M",
  Flipkart: "1gO6Y5MvaAqHanhx8uWrM78ORQIIkYP1K",
  JioMart: "1CM_xSrG3rr4Ldo9EZqfOidGdkG6fYZAO",
  meesho: "1KwF4JnFOOVoVSoW0feQQAP7Ow84hq0yx",
  WhatsApp: "1JLCZyxCsMRiJfnfkihwluLjjGJPSygx0",
  Instagram: "19MDZWRV6quP85n_ZXalwpF1ne_D1BXpo",
};

function LogoImage({ name }: { name: string }) {
  const [stage, setStage] = useState(0);
  const label = name === "amazon" ? "Amazon" : name;
  const file = LOGO_FILES[name];
  const driveId = LOGO_DRIVE_IDS[name];
  if (stage === 2 || !file) return <span className="text-lg font-semibold">{label}</span>;
  const src = stage === 0 ? `/images/marquee/${file}.png` : `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;
  return (
    <img
      src={src}
      alt={label}
      width={180}
      height={48}
      loading="lazy"
      className="h-12 w-auto max-w-[180px] object-contain"
      onError={() => setStage((s) => s + 1)}
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
          spaceBetween={40}
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
              <span className="flex min-h-12 items-center justify-center whitespace-nowrap text-navy">
                <LogoImage name={m.name} />
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
