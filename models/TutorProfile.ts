import mongoose from "mongoose";

const AvailabilitySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6 },
    startHour: { type: Number },
    endHour: { type: Number },
    durationMin: { type: Number, default: 60 },
  },
  { _id: false }
);

const TutorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true },
    bio: { type: String },
    subjects: [{ type: String }],
    hourlyRateGEL: { type: Number, required: true },
    yearsExperience: { type: Number, required: true },
    experience: { type: String, required: true },
    availability: [AvailabilitySlotSchema],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    avatarSeed: { type: String },
    approved: { type: Boolean, default: false },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export type ITutorProfile = mongoose.InferSchemaType<typeof TutorProfileSchema>;

export default mongoose.models.TutorProfile ||
  mongoose.model("TutorProfile", TutorProfileSchema);
