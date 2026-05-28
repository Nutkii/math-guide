import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Solution from "@/models/Solution";
import Problem from "@/models/Problem";
import { createSolutionSchema } from "@/lib/validations/problem";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get("problemId");

    if (!problemId) {
      return NextResponse.json({ error: "problemId required" }, { status: 400 });
    }

    const solutions = await Solution.find({ problemId })
      .sort({ upvotes: -1 })
      .lean();

    const serialized = solutions.map((s) => ({
      ...s,
      _id: s._id.toString(),
      problemId: s.problemId.toString(),
      authorId: s.authorId?.toString(),
    }));

    return NextResponse.json({ solutions: serialized });
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
    const parsed = createSolutionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const problem = await Problem.findById(parsed.data.problemId).lean();
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const solution = await Solution.create({
      ...parsed.data,
      authorId: session.user.id,
      authorName: session.user.name,
    });

    return NextResponse.json(
      { solution: { ...solution.toObject(), _id: solution._id.toString() } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
