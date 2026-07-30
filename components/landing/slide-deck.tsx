"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type DeckSlideMeta = { id: string; label: string };

export function SlideDeck({
  slides,
  children,
}: {
  slides: DeckSlideMeta[];
  children: React.ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [markerTop, setMarkerTop] = useState(0);
  const [markerReady, setMarkerReady] = useState(false);

  const total = slides.length;

  // Snap the slides to the page's own scroll (not a nested scrollbox) so
  // scrolling past the last slide into the footer — and back up — behaves
  // exactly like any other page on the site.
  useEffect(() => {
    document.body.classList.add("snap-deck");
    return () => document.body.classList.remove("snap-deck");
  }, []);

  // Track which slide is centered in the viewport as the page scrolls.
  useEffect(() => {
    const root = stageRef.current;
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
      { threshold: 0.6 },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Slide the little marker along the dot rail to whichever dot is active —
  // moves as you scroll, not just when you click.
  useLayoutEffect(() => {
    const dot = dotRefs.current[activeIndex];
    const nav = navRef.current;
    if (!dot || !nav) return;
    const dotRect = dot.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    setMarkerTop(dotRect.top - navRect.top + dotRect.height / 2);
    setMarkerReady(true);
  }, [activeIndex]);

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
      const root = stageRef.current;
      if (!root) return;

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
      <div ref={stageRef}>{children}</div>

      {/* Spiral binder spine — fills in as you scroll through, desktop only */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-3 top-16 bottom-0 z-20 hidden flex-col items-center justify-evenly md:left-6 md:flex"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const threshold = (i / 11) * (total - 1);
          const lit = activeIndex >= threshold;
          return (
            <span
              key={i}
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full border shadow-inner transition-all duration-500",
                lit
                  ? "scale-110 border-primary/60 bg-primary/70"
                  : "border-border/60 bg-background/80",
              )}
            />
          );
        })}
      </div>

      {/* Slide-sorter dots — click to jump, or just keep scrolling. A
          glowing marker travels the rail to whichever slide is active.
          Always on screen, never hidden past the footer. */}
      <nav
        ref={navRef}
        aria-label="Slides"
        className="fixed right-4 top-16 bottom-0 z-30 hidden flex-col items-end justify-center gap-3 sm:right-8 md:flex"
      >
        <span
          aria-hidden
          className={cn(
            "absolute right-0 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_2px] shadow-primary/60 transition-[top,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            markerReady ? "opacity-100" : "opacity-0",
          )}
          style={{ top: markerTop }}
        />
        {slides.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
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
                  ? "w-6 bg-primary/25"
                  : "w-2 bg-border group-hover:bg-primary/50",
              )}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
