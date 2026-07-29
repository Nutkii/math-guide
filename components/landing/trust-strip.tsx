import { useTranslations } from "next-intl";
import { BookOpen, Sparkles, GraduationCap, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: { key: "curriculum" | "ai" | "tutors" | "pricing"; icon: LucideIcon; color: string }[] = [
  { key: "curriculum", icon: BookOpen, color: "text-teal-500" },
  { key: "ai", icon: Sparkles, color: "text-cyan-500" },
  { key: "tutors", icon: GraduationCap, color: "text-emerald-500" },
  { key: "pricing", icon: Wallet, color: "text-redpen" },
];

export function TrustStrip() {
  const t = useTranslations("landing.trust");

  return (
    <section className="container">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-card/60 px-6 py-5 backdrop-blur sm:grid-cols-4">
        {items.map(({ key, icon: Icon, color }) => (
          <div key={key} className="flex items-center gap-2.5">
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
            <span className="text-sm font-medium text-foreground/90">
              {t(key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
