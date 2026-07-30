import { getTranslations } from "next-intl/server";
import { MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";

export default async function ChatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "chats" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="container max-w-2xl py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          {tc("backToDashboard")}
        </Link>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          <Link href="/chat" className="text-sm text-primary hover:underline">
            {t("goToChat")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
