import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import { verifyCallbackSignature } from "@/lib/payments/flitt";

export async function POST(req: Request) {
  const payload = await req.json();

  if (!verifyCallbackSignature(payload)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const {
    order_id: orderId,
    order_status: orderStatus,
    payment_id: paymentId,
  } = payload as {
    order_id?: string;
    order_status?: string;
    payment_id?: string | number;
  };
  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  await connectDB();

  const subscription = await Subscription.findOne({ flittOrderId: orderId });
  if (!subscription) {
    // Unknown order — acknowledge so Flitt doesn't retry, nothing local to update.
    return NextResponse.json({ ok: true });
  }

  // Each renewal cycle delivers a new payment_id under the same order_id —
  // dedupe on payment_id (not status) so monthly renewals still advance
  // currentPeriodEnd instead of getting stuck after the first approval.
  const paymentIdStr = paymentId != null ? String(paymentId) : undefined;
  const alreadyProcessed =
    paymentIdStr !== undefined && subscription.flittLastPaymentId === paymentIdStr;

  if (orderStatus === "approved" && !alreadyProcessed) {
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    subscription.status = "active";
    subscription.currentPeriodEnd = periodEnd;
    if (paymentIdStr !== undefined) subscription.flittLastPaymentId = paymentIdStr;
    await subscription.save();
  } else if (
    (orderStatus === "declined" || orderStatus === "expired") &&
    !alreadyProcessed
  ) {
    subscription.status = "expired";
    if (paymentIdStr !== undefined) subscription.flittLastPaymentId = paymentIdStr;
    await subscription.save();
  }

  return NextResponse.json({ ok: true });
}
