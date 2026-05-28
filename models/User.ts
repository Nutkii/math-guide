import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
    locale: { type: String, enum: ["ka", "en"], default: "ka" },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

export type IUser = mongoose.InferSchemaType<typeof UserSchema>;

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
