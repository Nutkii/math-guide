"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/book/book-cover";
import type { Book } from "@/lib/mock-data";

export function BookGradeFilter({ books }: { books: Book[] }) {
  const t = useTranslations("books");
  const [grade, setGrade] = useState<number | null>(null);

  const grades = useMemo(
    () => Array.from(new Set(books.map((b) => b.grade))).sort((a, b) => a - b),
    [books],
  );

  const filtered = grade === null ? books : books.filter((b) => b.grade === grade);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={grade === null ? "cool" : "outline"}
          onClick={() => setGrade(null)}
        >
          {t("filterAll")}
        </Button>
        {grades.map((g) => (
          <Button
            key={g}
            size="sm"
            variant={grade === g ? "cool" : "outline"}
            onClick={() => setGrade(g)}
          >
            {g}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((b) => (
          <BookCover key={b.slug} book={b} />
        ))}
      </div>
    </div>
  );
}
