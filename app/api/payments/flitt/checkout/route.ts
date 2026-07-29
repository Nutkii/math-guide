import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Subscription from "@/models/Subscription";
import { createSubscriptionCheckout } from "@/lib/payments/flitt";

const AI_SUBSCRIPTION_TETRI = 500; // 5 GEL

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const orderId = `sub_${session.user.id}_${Date.now()}`;

  const flittRes = await createSubscriptionCheckout({
    orderId,
    amountTetri: AI_SUBSCRIPTION_TETRI,
    orderDesc: "AI chat subscription - 5 GEL/month",
    responseUrl: `${baseUrl}/dashboard?flitt=return`,
    callbackUrl: `${baseUrl}/api/payments/flitt/callback`,
  });

  if (flittRes.response_status !== "success" || !flittRes.checkout_url) {
    return NextResponse.json(
      { error: flittRes.error_message ?? "Failed to create Flitt checkout" },
      { status: 502 }
    );
  }

  await Subscription.findOneAndUpdate(
    { userId: session.user.id },
    {
      userId: session.user.id,
      plan: "ai",
      status: "trialing",
      provider: "flitt",
      flittOrderId: orderId,
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ checkoutUrl: flittRes.checkout_url });
}
