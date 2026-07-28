"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MixedText } from "@/components/problem/math-render";

export default function ChatPage() {
  const t = useTranslations("nav");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="container max-w-3xl py-8 flex flex-col gap-4 min-h-[calc(100vh-180px)]">
      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-5 w-5 text-primary" />
          {t("chat")}
        </h1>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border/50 bg-card/40 p-4 backdrop-blur">
        {messages.length === 0 && (
          <p className="mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-gradient-to-br from-teal-500/10 to-emerald-500/10 px-4 py-2.5 text-sm leading-relaxed ring-1 ring-inset ring-teal-500/20">
            Hi! I can walk you through any math problem step by step. Paste your problem or describe what you&apos;re stuck on.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-gradient-to-br from-teal-500/10 to-emerald-500/10 px-4 py-2.5 ring-1 ring-inset ring-teal-500/20"
            }
          >
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {m.parts.map((part, i) =>
                part.type === "text" ? <MixedText key={i} text={part.text} /> : null
              )}
            </div>
          </div>
        ))}
        {(status === "submitted" || status === "streaming") && messages.at(-1)?.role === "user" && (
          <p className="mr-auto text-xs text-muted-foreground">Thinking…</p>
        )}
        {status === "error" && (
          <p className="mr-auto text-xs text-destructive">
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      <form onSubmit={onSend} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1"
          disabled={status !== "ready"}
        />
        <Button type="submit" variant="cool" size="icon" disabled={status !== "ready"}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
