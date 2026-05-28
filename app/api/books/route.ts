import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Chapter from "@/models/Chapter";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get("grade");

    const filter = grade ? { grade: Number(grade) } : {};
    const books = await Book.find(filter).sort({ grade: 1 }).lean();

    // Attach chapter count per book
    const booksWithCounts = await Promise.all(
      books.map(async (book) => {
        const chapterCount = await Chapter.countDocuments({ bookId: book._id });
        return {
          ...book,
          _id: book._id.toString(),
          chapterCount,
        };
      })
    );

    return NextResponse.json({ books: booksWithCounts });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
