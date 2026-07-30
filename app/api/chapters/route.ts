import { NextResponse } from "next/server";
import { getTopicsDB } from "@/lib/db-data";

export async function GET() {
  try {
    const topics = await getTopicsDB();
    const chapters = topics.map((t) => ({
      chapterId: t.chapterId,
      bookSlug: t.bookSlug,
      grade: t.grade,
      titleKa: t.titleKa,
      titleEn: t.titleEn,
      bookTitleKa: t.bookTitleKa,
      bookTitleEn: t.bookTitleEn,
    }));
    return NextResponse.json({ chapters });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
