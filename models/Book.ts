import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    titleKa: { type: String, required: true },
    titleEn: { type: String, required: true },
    grade: { type: Number, required: true },
    publisher: { type: String, required: true },
    coverGradient: { type: String },
  },
  { timestamps: true }
);

export type IBook = mongoose.InferSchemaType<typeof BookSchema>;

export default mongoose.models.Book ||
  mongoose.model("Book", BookSchema);
