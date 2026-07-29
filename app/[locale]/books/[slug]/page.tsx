import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBookBySlugDB } from "@/lib/db-data";

type Params = { locale: string; slug: string };

export default async function BookDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const book = await getBookBySlugDB(slug);
  if (!book) notFound();

  const tc = await getTranslations({ locale, namespace: "common" });
  const title = locale === "ka" ? book.titleKa : book.titleEn;

  return (
    <div className="container py-12">
      <div className="grid gap-10 md:grid-cols-[280px_1fr]">
        <div
          className="aspect-[3/4] rounded-2xl shadow-xl shadow-cyan-500/20"
          style={{ background: book.cover }}
        />
        <div className="space-y-8">
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="cool">
                {locale === "ka" ? "კლასი" : "Grade"} {book.grade}
              </Badge>
              <Badge variant="secondary">{book.publisher}</Badge>
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          </header>

          <div>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-primary" />
              {tc("chapter")}s
            </h2>
            <div className="space-y-2">
              {book.chapters.map((c) => {
                const chapterTitle = locale === "ka" ? c.titleKa : c.titleEn;
                return (
                  <Link
                    key={c.id}
                    href={`/problems?chapterId=${c.id}`}
                    className="group block"
                  >
                    <Card className="transition-all group-hover:border-primary/40">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-teal-500/15 to-emerald-500/15 font-bold text-primary">
                          {c.number}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{chapterTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {c.problemCount} problems
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
