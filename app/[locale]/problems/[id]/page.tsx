import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Sparkles, BookOpen } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MixedText } from "@/components/problem/math-render";
import { SolutionBlock } from "@/components/problem/solution-block";
import {
  getProblemByIdDB,
  getBookLiteBySlugDB,
  getSolutionsForProblemDB,
} from "@/lib/db-data";

type Params = { locale: string; id: string };

export default async function ProblemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, id } = await params;
  const problem = await getProblemByIdDB(id);
  if (!problem) notFound();

  const t = await getTranslations({ locale, namespace: "problem" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const book = await getBookLiteBySlugDB(problem.bookSlug);
  const sols = await getSolutionsForProblemDB(problem.id);
  const statement = locale === "ka" ? problem.statementKa : problem.statementEn;
  const bookTitle = book
    ? locale === "ka"
      ? book.titleKa
      : book.titleEn
    : "";

  return (
    <div className="container max-w-3xl py-12 space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {book && (
            <Link
              href={`/books/${book.slug}`}
              className="inline-flex items-center gap-1 hover:text-primary"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {bookTitle}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cool">
            {tc("problemNumber")}
            {problem.number}
          </Badge>
          <Badge variant="secondary">{problem.difficulty}</Badge>
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
          {t("solution")}s ({sols.length})
        </h2>
        {sols.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tc("empty")}</p>
        ) : (
          sols.map((s) => <SolutionBlock key={s.id} solution={s} />)
        )}
      </div>
    </div>
  );
}
