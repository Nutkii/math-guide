import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import Solution from "@/models/Solution";
import { createCommentSchema } from "@/lib/validations/problem";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const solutionId = searchParams.get("solutionId");

    if (!solutionId) {
      return NextResponse.json({ error: "solutionId required" }, { status: 400 });
    }

    const comments = await Comment.find({ solutionId }).sort({ createdAt: 1 }).lean();

    const serialized = comments.map((c) => ({
      ...c,
      _id: c._id.toString(),
      solutionId: c.solutionId.toString(),
      authorId: c.authorId?.toString(),
    }));

    return NextResponse.json({ comments: serialized });
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
    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const solution = await Solution.findById(parsed.data.solutionId).lean();
    if (!solution) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }

    const comment = await Comment.create({
      solutionId: parsed.data.solutionId,
      content: parsed.data.content,
      authorId: session.user.id,
      authorName: session.user.name,
    });

    return NextResponse.json(
      { comment: { ...comment.toObject(), _id: comment._id.toString() } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
