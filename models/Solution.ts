import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String },
    contentKa: { type: String, required: true },
    contentEn: { type: String },
    images: [{ type: String }],
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SolutionSchema.index({ problemId: 1 });

export type ISolution = mongoose.InferSchemaType<typeof SolutionSchema>;

export default mongoose.models.Solution ||
  mongoose.model("Solution", SolutionSchema);
