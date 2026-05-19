import { useTranslations } from "next-intl";
import { BookCover } from "@/components/book/book-cover";
import { books } from "@/lib/mock-data";

export default function BooksPage() {
  const t = useTranslations("nav");

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
