import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    bookSlug: { type: String, required: true },
    number: { type: Number, required: true },
    titleKa: { type: String, required: true },
    titleEn: { type: String, required: true },
  },
  { timestamps: true }
);

ChapterSchema.index({ bookId: 1, number: 1 }, { unique: true });

export type IChapter = mongoose.InferSchemaType<typeof ChapterSchema>;

export default mongoose.models.Chapter ||
  mongoose.model("Chapter", ChapterSchema);
