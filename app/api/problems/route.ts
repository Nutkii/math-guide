import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";
import Book from "@/models/Book";
import Chapter from "@/models/Chapter";
import { createProblemSchema } from "@/lib/validations/problem";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const bookSlug = searchParams.get("bookSlug");
    const chapterId = searchParams.get("chapterId");
    const difficulty = searchParams.get("difficulty");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

    const filter: Record<string, unknown> = { status: "approved" };
    if (bookSlug) filter.bookSlug = bookSlug;
    if (chapterId) filter.chapterId = chapterId;
    if (difficulty) filter.difficulty = difficulty;

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Problem.countDocuments(filter),
    ]);

    const serialized = problems.map((p) => ({
      ...p,
      _id: p._id.toString(),
      bookId: p.bookId.toString(),
      chapterId: p.chapterId.toString(),
      authorId: p.authorId?.toString(),
    }));

    return NextResponse.json({ problems: serialized, total, page, limit });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createProblemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const { bookSlug, chapterId, ...rest } = parsed.data;

    const book = await Book.findOne({ slug: bookSlug }).lean();
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const chapter = await Chapter.findById(chapterId).lean();
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const problem = await Problem.create({
      ...rest,
      bookSlug,
      bookId: book._id,
      chapterId: chapter._id,
      authorId: session.user.id,
      authorName: session.user.name,
      status: "pending",
    });

    return NextResponse.json(
      { problem: { ...problem.toObject(), _id: problem._id.toString() } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
