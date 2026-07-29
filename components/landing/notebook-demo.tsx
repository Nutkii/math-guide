import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { MathRender } from "@/components/problem/math-render";

export function NotebookDemo() {
  const t = useTranslations("landing.demo");

  return (
    <div className="relative mx-auto w-full max-w-sm rotate-2 rounded-2xl border border-border/60 bg-card p-6 shadow-2xl shadow-cyan-500/10 ring-1 ring-border/50 transition-transform duration-500 hover:rotate-0 sm:p-7">
      <div className="bg-grid-paper absolute inset-0 rounded-2xl" />
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-primary">
            {t("label")}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {t("reference")}
          </span>
        </div>

        <div className="animate-line-in text-lg">
          <MathRender inline>{"x^2 - 5x + 6 = 0"}</MathRender>
        </div>

        <div
          className="animate-line-in space-y-1 border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground"
          style={{ animationDelay: "0.35s" }}
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-primary/80">
            {t("factor")}
          </p>
          <MathRender inline className="text-foreground">
            {"(x-2)(x-3) = 0"}
          </MathRender>
        </div>

        <div
          className="animate-line-in space-y-1 border-l-2 border-emerald-500/40 pl-3 text-sm"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            {t("roots")}
          </p>
          <MathRender inline className="text-foreground">
            {"x_1 = 2, \\quad x_2 = 3"}
          </MathRender>
        </div>

        <div className="animate-stamp absolute -right-2 -top-2 flex -rotate-12 items-center gap-1 rounded-full border-2 border-redpen bg-background/90 px-2.5 py-1 text-redpen shadow-sm">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
          <span className="font-serif text-xs font-bold italic">
            {t("graded")}
          </span>
        </div>
      </div>
    </div>
  );
}
