import { getTranslations } from "next-intl/server";
import { Plus, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ProblemCard } from "@/components/problem/problem-card";
import { SearchBox } from "@/components/filters/search-box";
import { GradeFilter } from "@/components/filters/grade-filter";
import {
  getProblemsDB,
  getChapterDB,
  getChaptersOverviewDB,
  getGradesDB,
} from "@/lib/db-data";

type Params = { locale: string };
type Search = { chapterId?: string; grade?: string; q?: string };

export default async function ProblemsListPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const { chapterId, grade, q } = await searchParams;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tp = await getTranslations({ locale, namespace: "problem" });
  const gradeNum = grade ? Number(grade) : undefined;
  const grades = await getGradesDB();

  const header = (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-3xl font-bold md:text-4xl">{t("problems")}</h1>
      <Button asChild variant="cool">
        <Link href="/problems/new">
          <Plus className="h-4 w-4" />
          {tp("uploadTitle")}
        </Link>
      </Button>
    </header>
  );

  const filters = (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <SearchBox placeholder={tc("search")} />
      <GradeFilter grades={grades} />
    </div>
  );

  if (chapterId) {
    const chapter = await getChapterDB(chapterId);
    const problems = await getProblemsDB({ chapterId, q });
    const chapterTitle = chapter
      ? locale === "ka"
        ? chapter.titleKa
        : chapter.titleEn
      : "";

    return (
      <div className="container py-12">
        {header}
        {filters}
        <h2 className="mb-6 text-xl font-semibold">{chapterTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
        {problems.length === 0 && (
          <p className="text-sm text-muted-foreground">{tc("empty")}</p>
        )}
      </div>
    );
  }

  if (q) {
    const problems = await getProblemsDB({ grade: gradeNum, q });
    return (
      <div className="container py-12">
        {header}
        {filters}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <ProblemCard key={p.id} problem={p} />
          ))}
        </div>
        {problems.length === 0 && (
          <p className="text-sm text-muted-foreground">{tc("empty")}</p>
        )}
      </div>
    );
  }

  const overview = await getChaptersOverviewDB(6, gradeNum);

  return (
    <div className="container py-12">
      {header}
      {filters}

      <div className="space-y-10">
        {overview.map((ch) => (
          <section key={ch.chapterId}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {locale === "ka" ? ch.titleKa : ch.titleEn}
              </h2>
              <Link
                href={`/problems?chapterId=${ch.chapterId}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {tc("viewAll")} ({ch.total})
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ch.problems.map((p) => (
                <ProblemCard key={p.id} problem={p} />
              ))}
            </div>
          </section>
        ))}
        {overview.length === 0 && (
          <p className="text-sm text-muted-foreground">{tc("empty")}</p>
        )}
      </div>
    </div>
  );
}
