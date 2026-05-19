import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MixedText } from "./math-render";
import type { Problem } from "@/lib/mock-data";

const difficultyStyles = {
  easy: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  medium:
    "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-1 ring-inset ring-cyan-500/30",
  hard: "bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-500/30",
} as const;

export function ProblemCard({ problem }: { problem: Problem }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const statement =
    locale === "ka" ? problem.statementKa : problem.statementEn;

  return (
    <Link href={`/problems/${problem.id}`} className="group block">
      <Card className="h-full transition-all group-hover:border-primary/40 group-hover:ring-glow">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2">
            <Badge variant="cool">
              {t("problemNumber")}
              {problem.number}
            </Badge>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${difficultyStyles[problem.difficulty]}`}
            >
              {problem.difficulty}
            </span>
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {problem.solutionCount}
            </span>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed">
            <MixedText text={statement} />
          </p>
          <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
            <span>{problem.authorName}</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
