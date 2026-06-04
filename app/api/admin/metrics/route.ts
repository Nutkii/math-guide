import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Problem from "@/models/Problem";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin" ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const [totalUsers, totalTutors, pendingProblems, totalProblems] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "tutor" }),
      Problem.countDocuments({ status: "pending" }),
      Problem.countDocuments(),
    ]);
    return NextResponse.json({ totalUsers, totalTutors, pendingProblems, totalProblems });
  } catch (err) {
    console.error("[GET /api/admin/metrics]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
