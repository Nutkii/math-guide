import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";

export async function GET() {
  try {
    await connectDB();

    const tutors = await TutorProfile.find({ approved: true })
      .sort({ rating: -1 })
      .lean();

    const serialized = tutors.map((t) => ({
      ...t,
      _id: t._id.toString(),
      userId: t.userId.toString(),
    }));

    return NextResponse.json({ tutors: serialized });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
