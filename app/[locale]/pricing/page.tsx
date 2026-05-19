import { useTranslations } from "next-intl";
import { PriceTable } from "@/components/pricing/price-table";

export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <div className="container max-w-5xl py-16">
      <header className="mb-12 text-center">
        <h1 className="text-balance text-4xl font-bold md:text-5xl">
          <span className="text-gradient-cool">{t("title")}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {t("subtitle")}
        </p>
      </header>
      <PriceTable />
    </div>
  );
}
