import { useTranslations } from "next-intl";
import { Sigma } from "lucide-react";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("brand");
  const tn = useTranslations("nav");
  const tf = useTranslations("footer");

  const exploreLinks = [
    { href: "/problems", label: tn("problems") },
    { href: "/tutors", label: tn("tutors") },
    { href: "/pricing", label: tn("pricing") },
  ] as const;

  return (
    <footer className="border-t border-border/40 bg-background/40 backdrop-blur">
      <div className="container grid gap-8 py-10 sm:grid-cols-[1.4fr_1fr]">
        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-2 text-sm">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
              <Sigma className="h-4 w-4" />
            </span>
            <span className="font-serif font-semibold">{t("name")}</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <div className="space-y-2 sm:justify-self-end">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {tf("explore")}
          </p>
          <nav className="flex flex-col gap-1.5 text-sm">
            {exploreLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t border-dashed border-border/60">
        <div className="container py-4">
          <p className="text-xs text-muted-foreground">
            {tf("rights", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
