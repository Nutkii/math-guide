import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";
import TutorProfile from "@/models/TutorProfile";
import { createBookingSchema } from "@/lib/validations/booking";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    const tutor = await TutorProfile.findById(parsed.data.tutorId).lean();
    if (!tutor || !tutor.approved) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    const priceGEL = Math.round(
      (tutor.hourlyRateGEL * parsed.data.durationMin) / 60
    );

    const booking = await Booking.create({
      studentId: (session.user as { id: string }).id,
      tutorId: parsed.data.tutorId,
      startAt: new Date(parsed.data.startAt),
      durationMin: parsed.data.durationMin,
      priceGEL,
      status: "confirmed",
    });

    return NextResponse.json(
      { booking: { ...booking.toObject(), _id: booking._id.toString() } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
