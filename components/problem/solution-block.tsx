"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { ThumbsUp, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MixedText } from "./math-render";
import { formatShortDateTime } from "@/lib/date-format";
import type { Solution } from "@/lib/mock-data";
import type { CommentItem } from "@/lib/db-data";

export function SolutionBlock({
  solution,
  initialComments = [],
}: {
  solution: Solution;
  initialComments?: CommentItem[];
}) {
  const locale = useLocale();
  const t = useTranslations("problem");
  const { data: session } = useSession();
  const content = locale === "ka" ? solution.contentKa : solution.contentEn;
  const initials = solution.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  async function postComment() {
    if (newComment.trim().length === 0) return;
    setPosting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solutionId: solution.id, content: newComment.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setComments((prev) => [
        ...prev,
        {
          id: data.comment._id,
          solutionId: solution.id,
          authorName: session?.user?.name ?? "",
          content: newComment.trim(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewComment("");
    } catch {
      toast.error(t("toastSolutionFailed"));
    } finally {
      setPosting(false);
    }
  }

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
          <p className="text-xs text-muted-foreground">
            {solution.createdAt ? formatShortDateTime(new Date(solution.createdAt), locale) : ""}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed">
          <MixedText text={content} />
        </p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 border-t border-border/50 pt-4">
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary">
          <ThumbsUp className="h-3.5 w-3.5" />
          {solution.upvotes}
        </button>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">{t("comments")}</p>
          {comments.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("noComments")}</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-md bg-muted/40 px-3 py-2 text-xs">
                <span className="font-medium">{c.authorName}</span>{" "}
                <span className="text-muted-foreground">{c.content}</span>
              </div>
            ))
          )}
          {session?.user && (
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("addComment")}
                className="min-h-[36px] flex-1 resize-none text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                disabled={posting}
                onClick={postComment}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
