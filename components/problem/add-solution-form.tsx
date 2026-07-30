"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/routing";

export function AddSolutionForm({ problemId }: { problemId: string }) {
  const t = useTranslations("problem");
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session?.user) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          {t("askAI")}
        </Link>
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 5) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, contentKa: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("toastSolutionFailed"));
      toast.success(t("toastSolutionAdded"));
      setContent("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("toastSolutionFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("addSolutionPlaceholder")}
        className="min-h-[100px]"
      />
      <div className="flex justify-end">
        <Button type="submit" variant="cool" size="sm" disabled={isSubmitting}>
          <Send className="h-3.5 w-3.5" />
          {t("submitSolution")}
        </Button>
      </div>
    </form>
  );
}
