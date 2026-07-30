"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const labels: Record<string, string> = { ka: "ქართული", en: "English" };
const next: Record<string, "ka" | "en"> = { ka: "en", en: "ka" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const toggle = () => {
    router.replace(
      // @ts-expect-error - dynamic pathname
      { pathname, params },
      { locale: next[locale] },
    );
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5"
      aria-label="Switch language"
      onClick={toggle}
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{labels[locale]}</span>
    </Button>
  );
}
