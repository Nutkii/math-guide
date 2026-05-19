import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/lib/mock-data";

export function BookCover({ book }: { book: Book }) {
  const locale = useLocale();
  const title = locale === "ka" ? book.titleKa : book.titleEn;

  return (
    <Link href={`/books/${book.slug}`} className="group block">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg shadow-cyan-500/10 ring-1 ring-border/50 transition-all group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-cyan-500/20"
        style={{ background: book.cover }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-3 top-3">
          <Badge variant="cool" className="backdrop-blur-md">
            {locale === "ka" ? "კლ." : "Gr."} {book.grade}
          </Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-bold leading-tight drop-shadow-md">{title}</h3>
          <p className="mt-1 text-xs opacity-90">{book.publisher}</p>
        </div>
      </div>
    </Link>
  );
}
