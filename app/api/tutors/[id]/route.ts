import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TutorProfile from "@/models/TutorProfile";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const tutor = await TutorProfile.findById(id).lean();
    if (!tutor || !tutor.approved) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      tutor: {
        ...tutor,
        _id: tutor._id.toString(),
        userId: tutor.userId.toString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
