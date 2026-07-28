import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import TutorProfile from "@/models/TutorProfile";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      role,
      bio,
      subjects,
      hourlyRateGEL,
      yearsExperience,
      experience,
    } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });

    if (role === "tutor") {
      await TutorProfile.create({
        userId: user._id,
        name,
        bio,
        subjects,
        hourlyRateGEL,
        yearsExperience,
        experience,
        approved: false,
      });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[POST /api/auth/register]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
