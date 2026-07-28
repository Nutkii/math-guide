import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import TutorProfile from "@/models/TutorProfile";

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
    const tutorUsers = await User.find({ role: "tutor" }, { passwordHash: 0 }).lean();
    const userIds = tutorUsers.map((u) => u._id);
    const profiles = await TutorProfile.find({ userId: { $in: userIds } }).lean();
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    const tutors = tutorUsers.map((u) => {
      const profile = profileMap.get(u._id.toString());
      return {
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        profile: profile
          ? {
              _id: profile._id.toString(),
              approved: profile.approved,
              bio: profile.bio,
              subjects: profile.subjects,
              hourlyRateGEL: profile.hourlyRateGEL,
              yearsExperience: profile.yearsExperience,
              experience: profile.experience,
              rejectionReason: profile.rejectionReason,
            }
          : null,
      };
    });

    return NextResponse.json({ tutors });
  } catch (err) {
    console.error("[GET /api/admin/tutors]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
