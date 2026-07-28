import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";

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
  const { approved, rejectionReason } = await req.json();

  try {
    await connectDB();
    await TutorProfile.findOneAndUpdate(
      { userId: id },
      {
        approved,
        rejectionReason: approved ? undefined : rejectionReason,
      }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/admin/tutors/:id]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
