import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "TutorProfile", required: true },
    startAt: { type: Date, required: true },
    durationMin: { type: Number, required: true, default: 60 },
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "completed", "reviewed", "cancelled"],
      default: "pending_payment",
    },
    externalMeetUrl: { type: String },
    priceGEL: { type: Number, required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    reviewRating: { type: Number, min: 1, max: 5 },
    reviewText: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ studentId: 1 });
BookingSchema.index({ tutorId: 1, startAt: 1 });

export type IBooking = mongoose.InferSchemaType<typeof BookingSchema>;

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);
