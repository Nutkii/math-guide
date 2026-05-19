"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Send, Lock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MixedText } from "@/components/problem/math-render";

type Msg = { role: "user" | "assistant"; content: string };

const mockReply: Msg = {
  role: "assistant",
  content:
    "მოდი ნაბიჯ-ნაბიჯ. პირველი ნაბიჯი — ფაქტორიზაცია: $x^2 - 5x + 6 = (x-2)(x-3)$. რა გვაძლევს ეს? რომელი მნიშვნელობებისთვის $x$-ისა ხდება ფრჩხილში ნული?",
};

export default function ChatPage() {
  const t = useTranslations("nav");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I can walk you through any problem step by step. Paste your problem or describe what you're stuck on.",
    },
  ]);
  const [input, setInput] = useState("");

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      mockReply,
    ]);
    setInput("");
  };

  return (
    <div className="container max-w-3xl py-8 flex flex-col gap-4 min-h-[calc(100vh-180px)]">
      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-5 w-5 text-primary" />
          {t("chat")}
        </h1>
        <Badge variant="cool">
          <Lock className="mr-1 h-3 w-3" /> Subscription needed
        </Badge>
      </header>

      <Card className="bg-amber-50/40 border-amber-300/40 dark:bg-amber-950/20 dark:border-amber-500/30">
        <CardContent className="flex items-center justify-between gap-4 p-4 text-sm">
          <p>This is a preview. Real AI replies arrive in Phase 4.</p>
          <Button asChild size="sm" variant="cool">
            <Link href="/pricing">Get AI Pro</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-gradient-to-br from-teal-500/10 to-emerald-500/10 px-4 py-2.5 ring-1 ring-inset ring-teal-500/20"
            }
          >
            <p className="text-sm leading-relaxed">
              <MixedText text={m.content} />
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={onSend} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1"
        />
        <Button type="submit" variant="cool" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
