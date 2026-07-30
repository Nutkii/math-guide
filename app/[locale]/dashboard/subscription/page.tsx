import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subscription" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const session = await auth();
  let status: "active" | "trialing" | "cancelled" | "expired" | null = null;
  let currentPeriodEnd: string | null = null;
  if (session?.user) {
    await connectDB();
    const userId = (session.user as { id: string }).id;
    const sub = await Subscription.findOne(
      { userId },
      { status: 1, currentPeriodEnd: 1 }
    ).lean();
    status = (sub?.status as typeof status) ?? null;
    currentPeriodEnd = sub?.currentPeriodEnd
      ? new Date(sub.currentPeriodEnd).toLocaleDateString(locale === "ka" ? "ka-GE" : "en-US")
      : null;
  }

  return (
    <div className="container max-w-2xl py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          {tc("backToDashboard")}
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <SubscriptionCard status={status} />
          {!status && (
            <p className="text-sm text-muted-foreground">{t("detailsUnavailable")}</p>
          )}
          {currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              {locale === "ka" ? "ვადა გრძელდება: " : "Renews: "}
              {currentPeriodEnd}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
