import { useLocale } from "next-intl";
import { ThumbsUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MixedText } from "./math-render";
import type { Solution } from "@/lib/mock-data";

export function SolutionBlock({ solution }: { solution: Solution }) {
  const locale = useLocale();
  const content = locale === "ka" ? solution.contentKa : solution.contentEn;
  const initials = solution.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="border-l-2 border-l-teal-500/50">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <Avatar className="h-9 w-9 ring-1 ring-teal-500/20">
          <AvatarFallback className="bg-gradient-to-br from-teal-500/15 to-emerald-500/15 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{solution.authorName}</p>
          <p className="text-xs text-muted-foreground">{solution.createdAt}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed">
          <MixedText text={content} />
        </p>
      </CardContent>
      <CardFooter className="border-t border-border/50 pt-4">
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
          <ThumbsUp className="h-3.5 w-3.5" />
          {solution.upvotes}
        </button>
      </CardFooter>
    </Card>
  );
}
