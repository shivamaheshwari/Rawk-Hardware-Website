import { useState } from "react";
import { MARKETPLACES } from "../lib/site";

/**
 * Marketplace / social marquee. A seamless 30s loop (CSS, see app.css).
 * The duplicated second half is aria-hidden and untabbable, so screen
 * readers and keyboards see each platform once. Pause button + hover/focus
 * pause; reduced-motion users get a static wrapping list instead.
 * Only verified destinations are links — Flipkart / Meesho / JioMart
 * render as plain text, never as invented URLs (see lib/site.ts).
 */
function MarqueeItems({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {MARKETPLACES.map((m) => {
        const label = m.name === "WhatsApp" ? "WhatsApp" : m.name === "Instagram" ? "Instagram" : m.name;
        const content = (
          <span className="mx-6 flex min-h-11 items-center whitespace-nowrap text-lg font-semibold text-navy sm:mx-8">
            {m.name === "amazon" && <span className="font-bold lowercase tracking-tight">amazon <span aria-hidden className="text-brass">⌄</span></span>}
            {m.name === "Flipkart" && <span className="font-bold italic text-[#2874f0]">Flipkart</span>}
            {m.name === "meesho" && <span className="font-bold lowercase text-[#570d57]">meesho</span>}
            {m.name === "JioMart" && <span className="font-bold text-[#0078ad]">JioMart</span>}
            {m.name === "WhatsApp" && <span className="font-semibold text-[#176b42]">WhatsApp</span>}
            {m.name === "Instagram" && <span className="font-semibold">Instagram</span>}
          </span>
        );
        return m.url ? (
          <a key={m.name} href={m.url} target="_blank" rel="noreferrer" title={m.note} aria-label={label} tabIndex={hidden ? -1 : undefined} className="transition-opacity duration-300 hover:opacity-70">
            {content}
          </a>
        ) : (
          <span key={m.name} title={m.note} className="cursor-default">
            {content}
          </span>
        );
      })}
    </div>
  );
}

export default function MarketplaceMarquee() {
  const [paused, setPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const stopped = paused || hoverPaused;
  return (
    <section aria-label="Shop RAWK on your favourite platform" className="border-y border-line bg-white py-8">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-navy sm:text-3xl">Shop RAWK on your favourite platform</h2>
            <p className="mt-1 text-sm text-muted">Shop online or connect with us.</p>
          </div>
          <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play marketplace marquee" : "Pause marketplace marquee"} className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white">
            {paused ? "▶" : "❚❚"}
          </button>
        </div>
      </div>
      <div className="mt-6 overflow-hidden" onMouseEnter={() => setHoverPaused(true)} onMouseLeave={() => setHoverPaused(false)} onFocus={() => setHoverPaused(true)} onBlur={() => setHoverPaused(false)}>
        <div className={`rawk-marquee-track flex w-max ${stopped ? "marquee-paused" : ""}`}>
          <MarqueeItems />
          <MarqueeItems hidden />
        </div>
      </div>
      <p className="mx-auto mt-4 w-full max-w-[1440px] px-4 text-xs text-muted sm:px-8 lg:px-12">
        Amazon links to the verified D2 listing and Instagram to @rawk_04. Flipkart, Meesho and JioMart store links are not yet verified, so they are shown unlinked.
      </p>
    </section>
  );
}
