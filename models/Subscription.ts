import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["free", "ai", "tutor"], default: "free" },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "trialing"],
      default: "active",
    },
    provider: { type: String, enum: ["tbc", "bog", "flitt"] },
    providerSubId: { type: String },
    cardToken: { type: String },
    flittOrderId: { type: String },
    flittLastPaymentId: { type: String },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1 });

export type ISubscription = mongoose.InferSchemaType<typeof SubscriptionSchema>;

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
