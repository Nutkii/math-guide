import { cn } from "@/lib/utils";

export function Slide({
  id,
  index,
  total,
  eyebrow,
  ink = false,
  first = false,
  className,
  contentClassName,
  overlay,
  children,
}: {
  id: string;
  index: number;
  total: number;
  eyebrow: string;
  /** Dark/gradient slide — flips corner-tag and paper-grid contrast */
  ink?: boolean;
  /** Marks the initially-visible slide so its .reveal children show before JS/IO runs */
  first?: boolean;
  className?: string;
  contentClassName?: string;
  /** Full-bleed decorative layer behind the content, e.g. a texture on a gradient slide */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-slide
      {...(first ? { "data-active": "" } : {})}
      className={cn(
        "relative flex h-[calc(100dvh_-_4rem)] w-full shrink-0 snap-start flex-col justify-center overflow-x-hidden overflow-y-auto px-6 py-14 sm:px-10 sm:py-20 md:pl-24 md:pr-16 lg:pl-32",
        !ink && "bg-grid-paper",
        index > 0 && "border-t border-dashed border-border/50",
        className,
      )}
    >
      {overlay}
      <div
        className={cn(
          "pointer-events-none absolute right-6 top-6 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-wide sm:right-10 sm:top-8 sm:flex",
          ink ? "text-white/60" : "text-muted-foreground/70",
        )}
      >
        <span>{eyebrow}</span>
        <span className={ink ? "text-white/30" : "text-border"}>/</span>
        <span className={ink ? "text-white/30" : "text-border"}>
          {String(index + 1).padStart(2, "0")}–{String(total).padStart(2, "0")}
        </span>
      </div>
      <div className={cn("mx-auto w-full max-w-6xl", contentClassName)}>
        {children}
      </div>
    </section>
  );
}
