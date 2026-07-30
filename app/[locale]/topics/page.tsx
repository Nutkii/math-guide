import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { PageHero } from "@/components/layout/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradeFilter } from "@/components/filters/grade-filter";
import { getTopicsDB, getGradesDB } from "@/lib/db-data";

type Params = { locale: string };
type Search = { grade?: string };

export default async function TopicsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const { grade } = await searchParams;
  const t = await getTranslations({ locale, namespace: "topics" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const gradeNum = grade ? Number(grade) : undefined;
  const [topics, grades] = await Promise.all([
    getTopicsDB(gradeNum),
    getGradesDB(),
  ]);

  return (
    <div className="container py-12">
      <PageHero title={t("title")} subtitle={t("subtitle")} align="left" />

      <div className="mb-8">
        <GradeFilter grades={grades} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.chapterId}
            href={`/problems?chapterId=${topic.chapterId}`}
            className="group block"
          >
            <Card className="h-full transition-all group-hover:border-primary/40 group-hover:ring-glow">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="cool">
                    {tc("gradeShort", { grade: topic.grade })}
                  </Badge>
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    {tc("problemsCount", { count: topic.problemCount })}
                  </span>
                </div>
                <h2 className="font-semibold leading-snug">
                  {locale === "ka" ? topic.titleKa : topic.titleEn}
                </h2>
                <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <span>{locale === "ka" ? topic.bookTitleKa : topic.bookTitleEn}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {topics.length === 0 && (
        <p className="text-sm text-muted-foreground">{tc("empty")}</p>
      )}
    </div>
  );
}
