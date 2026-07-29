import { useTranslations } from "next-intl";
import { BookOpen, Sparkles, GraduationCap, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: {
  key: "curriculum" | "ai" | "tutors" | "pricing";
  icon: LucideIcon;
  ring: string;
  tint: string;
}[] = [
  {
    key: "curriculum",
    icon: BookOpen,
    ring: "ring-teal-500/30",
    tint: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    key: "ai",
    icon: Sparkles,
    ring: "ring-cyan-500/30",
    tint: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    key: "tutors",
    icon: GraduationCap,
    ring: "ring-emerald-500/30",
    tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "pricing",
    icon: Wallet,
    ring: "ring-redpen/30",
    tint: "bg-redpen/10 text-redpen",
  },
];

export function TrustStrip() {
  const t = useTranslations("landing.trust");

  return (
    <div className="space-y-12">
      <div className="reveal text-center">
        <h2 className="text-balance font-serif text-3xl font-bold tracking-tight md:text-5xl">
          <span className="text-gradient-cool">{t("title")}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, icon: Icon, ring, tint }, i) => (
          <div
            key={key}
            className="reveal rounded-2xl border border-border/60 bg-card/80 p-6 text-center shadow-sm backdrop-blur"
            style={{ transitionDelay: `${150 + i * 100}ms` }}
          >
            <div
              className={`mx-auto grid h-14 w-14 place-items-center rounded-full ring-1 ring-inset ${ring} ${tint}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-semibold leading-snug text-foreground/90">
              {t(key)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
