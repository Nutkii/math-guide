"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type DeckSlideMeta = { id: string; label: string };

export function SlideDeck({
  slides,
  children,
}: {
  slides: DeckSlideMeta[];
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  // Track which slide is centered in the deck's own scroll box (not the
  // document — the deck scrolls internally, independent of page scroll).
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-slide]"),
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.toggleAttribute("data-active", entry.isIntersecting);
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
          }
        });
      },
      { root, threshold: 0.6 },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Once the deck itself scrolls out of view (page continues to the real
  // footer), hide the floating slide chrome instead of letting it float
  // over unrelated content.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(target.tagName)
      ) {
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const root = scrollRef.current;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>("[data-slide]"),
      );
      const next =
        e.key === "ArrowDown"
          ? Math.min(activeIndexRef.current + 1, sections.length - 1)
          : Math.max(activeIndexRef.current - 1, 0);
      if (next !== activeIndexRef.current) {
        e.preventDefault();
        sections[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        className="h-[calc(100dvh_-_4rem)] snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        {children}
      </div>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {/* Spiral binder spine — purely decorative, desktop only */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-3 top-16 bottom-0 z-20 hidden flex-col items-center justify-evenly transition-opacity duration-300 md:left-6 md:flex",
          navVisible ? "opacity-100" : "opacity-0",
        )}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 shrink-0 rounded-full border border-border/60 bg-background/80 shadow-inner"
          />
        ))}
      </div>

      {/* Slide-sorter dots — click to jump, desktop only */}
      <nav
        aria-label="Slides"
        className={cn(
          "fixed right-4 top-16 bottom-0 z-30 hidden flex-col items-end justify-center gap-3 transition-opacity duration-300 sm:right-8 md:flex",
          navVisible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={s.label}
            aria-current={activeIndex === i}
            onClick={() =>
              document
                .getElementById(s.id)
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="group flex items-center gap-2"
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-wide transition-opacity",
                activeIndex === i
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100",
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "h-2 rounded-full transition-all",
                activeIndex === i
                  ? "w-6 bg-primary"
                  : "w-2 bg-border group-hover:bg-primary/50",
              )}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
