import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";
import Solution from "@/models/Solution";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const problem = await Problem.findById(id).lean();
    if (!problem || problem.status !== "approved") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const solutions = await Solution.find({ problemId: problem._id })
      .sort({ upvotes: -1 })
      .lean();

    return NextResponse.json({
      problem: {
        ...problem,
        _id: problem._id.toString(),
        bookId: problem.bookId.toString(),
        chapterId: problem.chapterId.toString(),
        authorId: problem.authorId?.toString(),
      },
      solutions: solutions.map((s) => ({
        ...s,
        _id: s._id.toString(),
        problemId: s.problemId.toString(),
        authorId: s.authorId?.toString(),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
