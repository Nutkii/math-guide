import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Problem from "@/models/Problem";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin" ? session : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, rejectionReason } = body;

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await connectDB();
    const update: Record<string, unknown> = { status };
    if (status === "rejected" && rejectionReason) {
      update.rejectionReason = rejectionReason;
    }
    await Problem.findByIdAndUpdate(id, update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/admin/problems/:id]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
