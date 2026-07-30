import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MixedText } from "@/components/problem/math-render";
import { auth } from "@/auth";
import { getMyProblemsDB } from "@/lib/db-data";

const statusVariant = {
  approved: "cool",
  pending: "outline",
  rejected: "destructive",
} as const;

export default async function MyUploadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "uploads" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const ta = await getTranslations({ locale, namespace: "admin" });

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const problems = userId ? await getMyProblemsDB(userId) : [];

  const statusLabel = {
    approved: ta("statusApproved"),
    pending: ta("statusPending"),
    rejected: ta("statusRejected"),
  } as const;

  return (
    <div className="container max-w-3xl py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/dashboard" className="text-sm text-primary hover:underline">
          {tc("backToDashboard")}
        </Link>
      </div>

      {problems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Link href="/problems/new" className="text-sm text-primary hover:underline">
              {t("uploadNow")}
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {problems.map((p) => (
            <Link key={p.id} href={`/problems/${p.id}`} className="block">
              <Card className="transition-all hover:border-primary/40 hover:ring-glow">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {tc("problemNumber")}
                        {p.number}
                      </span>
                      <Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge>
                    </div>
                    <p className="line-clamp-1 text-sm">
                      <MixedText text={locale === "ka" ? p.statementKa : p.statementEn} />
                    </p>
                    {p.status === "rejected" && p.rejectionReason && (
                      <p className="text-xs text-destructive">{p.rejectionReason}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
