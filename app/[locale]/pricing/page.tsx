import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { PriceTable } from "@/components/pricing/price-table";

export default function PricingPage() {
  const t = useTranslations("pricing");
  const trust = t.raw("trust") as readonly string[];

  return (
    <div className="container max-w-5xl py-16">
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <div className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {trust.map((item) => (
          <span
            key={item}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {item}
          </span>
        ))}
      </div>
      <PriceTable />
    </div>
  );
}
