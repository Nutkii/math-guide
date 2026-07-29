import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    bookSlug: { type: String, required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
    number: { type: String, required: true },
    statementKa: { type: String, required: true },
    statementEn: { type: String },
    statementImages: [{ type: String }],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    isTest: { type: Boolean, default: false },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

ProblemSchema.index({ bookSlug: 1, status: 1 });
ProblemSchema.index({ chapterId: 1 });

export type IProblem = mongoose.InferSchemaType<typeof ProblemSchema>;

export default mongoose.models.Problem ||
  mongoose.model("Problem", ProblemSchema);
