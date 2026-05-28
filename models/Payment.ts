import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["tbc", "bog"], required: true },
    providerTxnId: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "GEL" },
    type: { type: String, enum: ["subscription", "booking"], required: true },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1 });

export type IPayment = mongoose.InferSchemaType<typeof PaymentSchema>;

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
