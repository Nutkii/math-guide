import { useTranslations } from "next-intl";
import { Plus, Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProblemCard } from "@/components/problem/problem-card";
import { problems } from "@/lib/mock-data";

export default function ProblemsListPage() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <div className="container py-12">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold md:text-4xl">{t("problems")}</h1>
        <Button asChild variant="cool">
          <Link href="/problems/new">
            <Plus className="h-4 w-4" />
            Upload problem
          </Link>
        </Button>
      </header>

      <div className="mb-8 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder={tc("search")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => (
          <ProblemCard key={p.id} problem={p} />
        ))}
      </div>
    </div>
  );
}
