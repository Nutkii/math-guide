import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "mb-10 space-y-4",
        centered && "text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur",
            centered && "mx-auto",
          )}
        >
          {eyebrow}
        </div>
      )}
      <h1 className="text-balance font-serif text-3xl font-bold tracking-tight md:text-4xl">
        <span className="text-gradient-cool">{title}</span>
      </h1>
      {subtitle && (
        <p
          className={cn(
            "text-balance text-muted-foreground",
            centered && "mx-auto max-w-xl",
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
