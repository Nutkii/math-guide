import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    solutionId: { type: mongoose.Schema.Types.ObjectId, ref: "Solution", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

CommentSchema.index({ solutionId: 1 });

export type IComment = mongoose.InferSchemaType<typeof CommentSchema>;

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
