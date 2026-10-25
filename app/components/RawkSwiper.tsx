import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

/**
 * Common client-side Swiper slider.
 *
 * Server rendering: the first slide is rendered statically (no Swiper JS),
 * so the first slide's copy and image are in the HTML for crawlers and for
 * the first paint. Swiper itself only mounts after hydration, which is why
 * this component is explicitly client-side.
 *
 * Behaviour (Design.md): 6s autoplay, pause on hover / focus / off-screen,
 * pause under prefers-reduced-motion, keyboard arrows, touch swipe.
 * Callers that need their own control bar (hero counter + progress) pass
 * onSwiper / onActiveChange and set showArrows/showDots to false.
 */
export type RawkSwiperProps = {
  label: string;
  children: ReactNode;
  perView?: { mobile: number; tablet: number; desktop: number };
  spaceBetween?: number;
  autoplay?: boolean;
  autoplayMs?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  /** Swiper's own page dots (one per slidesPerGroup page, not per slide). */
  usePagination?: boolean;
  /** Hero: false — autoplay must keep running on hover. Default true. */
  pauseOnHover?: boolean;
  /** Transition duration in ms (best sellers: smooth 1000ms). */
  speed?: number;
  className?: string;
  /** Set by a caller-owned pause/play control (hero). Hover/focus pauses never override it. */
  paused?: boolean;
  onSwiper?: (swiper: SwiperType) => void;
  onActiveChange?: (index: number) => void;
  onAutoplayProgress?: (progress: number) => void;
};

export default function RawkSwiper({
  label,
  children,
  perView = { mobile: 1, tablet: 2, desktop: 4 },
  spaceBetween = 16,
  autoplay = false,
  autoplayMs = 6000,
  loop = false,
  showArrows = true,
  showDots = true,
  usePagination = false,
  pauseOnHover = true,
  speed = 500,
  className = "",
  paused = false,
  onSwiper,
  onActiveChange,
  onAutoplayProgress,
}: RawkSwiperProps) {
  const slides = Children.toArray(children);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    setMounted(true);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Pause autoplay while the slider is off-screen.
  useEffect(() => {
    if (!mounted || !autoplay || !wrapRef.current) return;
    const el = wrapRef.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const sw = swiperRef.current;
        if (!sw?.autoplay) return;
        if (entry.isIntersecting && !pausedRef.current) sw.autoplay.start();
        else sw.autoplay.stop();
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted, autoplay]);

  const pause = () => { if (pauseOnHover) swiperRef.current?.autoplay?.stop(); };
  const resume = () => {
    if (pauseOnHover && autoplay && !reducedMotion && !pausedRef.current) swiperRef.current?.autoplay?.start();
  };

  if (!mounted || slides.length === 0) {
    // Static first slide only — SSR-safe, no layout shift for the hero copy.
    return (
      <div ref={wrapRef} aria-label={label} className={className}>
        {slides[0] ?? null}
      </div>
    );
  }

  const handleSwiper = (sw: SwiperType) => {
    swiperRef.current = sw;
    onSwiper?.(sw);
  };
  const handleChange = (sw: SwiperType) => {
    const idx = loop ? sw.realIndex : sw.activeIndex;
    setActive(idx);
    onActiveChange?.(idx);
  };
  const maxIndex = loop ? slides.length - 1 : Math.max(0, slides.length - 1);

  return (
    <div
      ref={wrapRef}
      className={className}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <Swiper
        modules={[A11y, Autoplay, Keyboard, Pagination]}
        a11y={{ enabled: true, containerMessage: label }}
        keyboard={{ enabled: true }}
        speed={speed}
        autoplay={
          autoplay && !reducedMotion
            ? { delay: autoplayMs, disableOnInteraction: false, pauseOnMouseEnter: pauseOnHover }
            : false
        }
        pagination={usePagination ? { clickable: true } : false}
        loop={loop}
        spaceBetween={spaceBetween}
        slidesPerView={perView.mobile}
        slidesPerGroup={perView.mobile}
        breakpoints={{
          768: { slidesPerView: perView.tablet, slidesPerGroup: perView.tablet },
          1024: { slidesPerView: perView.desktop, slidesPerGroup: perView.desktop },
        }}
        onSwiper={handleSwiper}
        onSlideChange={handleChange}
        onAutoplayTimeLeft={(_sw, _time, progress) => onAutoplayProgress?.(progress)}
        aria-label={label}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>{slide}</SwiperSlide>
        ))}
      </Swiper>
      {(showArrows || showDots) && slides.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          {showArrows && (
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={!loop && active === 0}
              aria-label="Previous items"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-navy"
            >
              ←
            </button>
          )}
          {showDots && (
            <div className="flex gap-1.5" role="tablist" aria-label={`${label} pages`}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    loop ? swiperRef.current?.slideToLoop(i) : swiperRef.current?.slideTo(i)
                  }
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-6 bg-brass" : "w-2.5 bg-line"
                  }`}
                />
              ))}
            </div>
          )}
          {showArrows && (
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              disabled={!loop && active >= maxIndex}
              aria-label="Next items"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:bg-navy hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-navy"
            >
              →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
