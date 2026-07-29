import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { BookGradeFilter } from "@/components/book/book-grade-filter";
import { getBooksDB } from "@/lib/db-data";

export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "books" });
  const books = await getBooksDB();

  return (
    <div className="container py-12">
      <PageHero title={t("title")} subtitle={t("subtitle")} align="left" />
      <BookGradeFilter books={books} />
    </div>
  );
}
