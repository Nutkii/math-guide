import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Sparkles, Layers, AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MixedText } from "@/components/problem/math-render";
import { SolutionBlock } from "@/components/problem/solution-block";
import { AddSolutionForm } from "@/components/problem/add-solution-form";
import { auth } from "@/auth";
import {
  getProblemByIdDB,
  getChapterDB,
  getSolutionsForProblemDB,
  getCommentsForSolutionsDB,
} from "@/lib/db-data";

type Params = { locale: string; id: string };

export default async function ProblemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, id } = await params;
  const session = await auth();
  const viewerId = (session?.user as { id?: string } | undefined)?.id;
  const problem = await getProblemByIdDB(id, viewerId);
  if (!problem) notFound();

  const t = await getTranslations({ locale, namespace: "problem" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const chapter = await getChapterDB(problem.chapterId);
  const sols = await getSolutionsForProblemDB(problem.id);
  const commentsBySolution = await getCommentsForSolutionsDB(sols.map((s) => s.id));
  const statement = locale === "ka" ? problem.statementKa : problem.statementEn;
  const topicTitle = chapter
    ? locale === "ka"
      ? chapter.titleKa
      : chapter.titleEn
    : "";

  return (
    <div className="container max-w-3xl py-12 space-y-8">
      {problem.status && problem.status !== "approved" && (
        <div
          className={
            problem.status === "rejected"
              ? "flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
              : "flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-300"
          }
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p>
              {problem.status === "rejected" ? t("rejectedOwnerNotice") : t("pendingOwnerNotice")}
            </p>
            {problem.status === "rejected" && problem.rejectionReason && (
              <p className="mt-1 opacity-80">{problem.rejectionReason}</p>
            )}
          </div>
        </div>
      )}

      <header className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {chapter && (
            <Link
              href={`/problems?chapterId=${chapter.id}`}
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <Layers className="h-3.5 w-3.5" />
              {topicTitle}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cool">
            {tc("problemNumber")}
            {problem.number}
          </Badge>
          <Badge variant="secondary">
            {tc(
              problem.difficulty === "easy"
                ? "difficultyEasy"
                : problem.difficulty === "medium"
                  ? "difficultyMedium"
                  : "difficultyHard",
            )}
          </Badge>
        </div>
      </header>

      <Card className="bg-gradient-cool">
        <CardHeader>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t("statement")}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            <MixedText text={statement} />
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button asChild size="lg" variant="cool">
          <Link href={`/chat?problem=${problem.id}`}>
            <Sparkles className="h-4 w-4" />
            {t("askAI")}
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t("solutionsHeading", { count: sols.length })}
        </h2>
        {sols.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tc("empty")}</p>
        ) : (
          sols.map((s) => (
            <SolutionBlock
              key={s.id}
              solution={s}
              initialComments={commentsBySolution.get(s.id) ?? []}
            />
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("addSolution")}</h2>
        <AddSolutionForm problemId={problem.id} />
      </div>
    </div>
  );
}
