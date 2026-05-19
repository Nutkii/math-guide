import { useTranslations } from "next-intl";
import { Sigma } from "lucide-react";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("brand");

  return (
    <footer className="border-t border-border/40 bg-background/40 backdrop-blur">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <Link href="/" className="flex items-center gap-2 text-sm">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
            <Sigma className="h-4 w-4" />
          </span>
          <span className="font-semibold">{t("name")}</span>
          <span className="text-muted-foreground">— {t("tagline")}</span>
        </Link>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Math Guide. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
