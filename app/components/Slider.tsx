import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
// No autoplay (design.md §8). Manual prev/next + dots + keyboard arrows + swipe.
export default function Slider({ children, label, perView = { mobile: 1, tablet: 2, desktop: 4 } }: { children: ReactNode[]; label: string; perView?: { mobile: number; tablet: number; desktop: number } }) {
  const [index, setIndex] = useState(0);
  const [pv, setPv] = useState(1);
  const touchX = useRef<number | null>(null);
  useEffect(() => {
    const mq = () => setPv(window.innerWidth >= 1024 ? perView.desktop : window.innerWidth >= 768 ? perView.tablet : perView.mobile);
    mq(); window.addEventListener("resize", mq); return () => window.removeEventListener("resize", mq);
  }, [perView.desktop, perView.tablet, perView.mobile]);
  const max = Math.max(0, children.length - pv);
  const go = useCallback((n: number) => setIndex(Math.max(0, Math.min(max, n))), [max]);
  useEffect(() => { if (index > max) setIndex(max); }, [max, index]);
  const onTouchStart = (e: TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1)); touchX.current = null;
  };
  const pages = max + 1;
  return (
    <div onKeyDown={(e) => { if (e.key === "ArrowRight") go(index + 1); if (e.key === "ArrowLeft") go(index - 1); }}>
      <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} role="region" aria-roledescription="carousel" aria-label={label}>
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${index * (100 / pv)}%)` }}>
          {children.map((c, i) => (<div key={i} className="shrink-0 px-2" style={{ width: `${100 / pv}%` }}>{c}</div>))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous items" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy disabled:opacity-40">←</button>
        <div className="flex gap-1.5" role="tablist" aria-label="Slider pages">
          {Array.from({ length: pages }).map((_, i) => (<button key={i} type="button" onClick={() => go(i)} aria-label={`Go to page ${i + 1}`} aria-current={i === index} className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-brass" : "w-2.5 bg-line"}`} />))}
        </div>
        <button type="button" onClick={() => go(index + 1)} disabled={index === max} aria-label="Next items" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy disabled:opacity-40">→</button>
      </div>
    </div>);
}
