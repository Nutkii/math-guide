import { getTranslations } from "next-intl/server";
import { BookCover } from "@/components/book/book-cover";
import { getBooksDB } from "@/lib/db-data";

export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const books = await getBooksDB();

  return (
    <div className="container py-12">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold md:text-4xl">{t("books")}</h1>
        <p className="text-muted-foreground">
          Browse the Georgian math curriculum, grade by grade.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((b) => (
          <BookCover key={b.slug} book={b} />
        ))}
      </div>
    </div>
  );
}
