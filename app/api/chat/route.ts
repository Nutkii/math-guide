import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { auth } from "@/auth";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const MODEL = "openai/gpt-4o-mini";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, locale }: { messages: UIMessage[]; locale?: string } = await req.json();
  const responseLocale = locale === "en" ? "en" : "ka";

  const result = streamText({
    model: openrouter(MODEL),
    system: buildSystemPrompt(responseLocale),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
