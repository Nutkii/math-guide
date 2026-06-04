import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin" ? session : null;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = new URL(req.url).searchParams.get("status");

  try {
    await connectDB();
    const query = status ? { status } : {};
    const problems = await Problem.find(query).sort({ createdAt: -1 }).lean();
    const serialized = problems.map((p) => ({ ...p, _id: p._id.toString() }));
    return NextResponse.json({ problems: serialized });
  } catch (err) {
    console.error("[GET /api/admin/problems]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
