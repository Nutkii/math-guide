import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Chapter from "@/models/Chapter";
import Problem from "@/models/Problem";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const book = await Book.findOne({ slug }).lean();
    if (!book) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const chapters = await Chapter.find({ bookId: book._id })
      .sort({ number: 1 })
      .lean();

    const chaptersWithCounts = await Promise.all(
      chapters.map(async (ch) => {
        const problemCount = await Problem.countDocuments({
          chapterId: ch._id,
          status: "approved",
        });
        return {
          ...ch,
          _id: ch._id.toString(),
          bookId: ch.bookId.toString(),
          problemCount,
        };
      })
    );

    return NextResponse.json({
      book: { ...book, _id: book._id.toString() },
      chapters: chaptersWithCounts,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
