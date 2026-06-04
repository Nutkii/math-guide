import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    const serialized = users.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));
    return NextResponse.json({ users: serialized });
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
