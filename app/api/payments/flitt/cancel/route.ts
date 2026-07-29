import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import { startStopSubscription } from "@/lib/payments/flitt";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const subscription = await Subscription.findOne({ userId: session.user.id, provider: "flitt" });
  if (!subscription?.flittOrderId) {
    return NextResponse.json({ error: "No active Flitt subscription" }, { status: 404 });
  }

  const flittRes = await startStopSubscription(subscription.flittOrderId, "stop");
  if (flittRes.response_status !== "success") {
    return NextResponse.json(
      { error: flittRes.error_message ?? "Failed to cancel subscription" },
      { status: 502 }
    );
  }

  subscription.status = "cancelled";
  await subscription.save();

  return NextResponse.json({ ok: true });
}
