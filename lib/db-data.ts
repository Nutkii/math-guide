import { connectDB } from "@/lib/db";
import BookModel from "@/models/Book";
import ChapterModel from "@/models/Chapter";
import ProblemModel from "@/models/Problem";
import SolutionModel from "@/models/Solution";
import type { Problem, Solution } from "@/lib/mock-data";

async function solutionCounts(problemIds: string[]) {
  if (problemIds.length === 0) return new Map<string, number>();
  const rows = await SolutionModel.aggregate([
    { $match: { problemId: { $in: problemIds } } },
    { $group: { _id: "$problemId", count: { $sum: 1 } } },
  ]);
  return new Map<string, number>(
    rows.map((r) => [r._id.toString(), r.count as number])
  );
}

type ProblemDoc = {
  _id: unknown;
  bookSlug: string;
  chapterId: unknown;
  number: string;
  statementKa: string;
  statementEn?: string;
  difficulty: "easy" | "medium" | "hard";
  authorName?: string;
};

function mapProblem(p: ProblemDoc, counts: Map<string, number>): Problem {
  const id = String(p._id);
  return {
    id,
    bookSlug: p.bookSlug,
    chapterId: String(p.chapterId),
    number: p.number,
    statementKa: p.statementKa,
    statementEn: p.statementEn ?? p.statementKa,
    difficulty: p.difficulty,
    solutionCount: counts.get(id) ?? 0,
    authorName: p.authorName ?? "",
  };
}

export async function getChapterDB(chapterId: string) {
  await connectDB();
  const c = await ChapterModel.findById(chapterId).lean();
  if (!c) return null;
  return {
    id: String(c._id),
    number: c.number,
    titleKa: c.titleKa,
    titleEn: c.titleEn,
    bookSlug: c.bookSlug,
  };
}

export async function getProblemsDB(filter: {
  bookSlug?: string;
  chapterId?: string;
}): Promise<Problem[]> {
  await connectDB();
  const q: Record<string, unknown> = { status: "approved" };
  if (filter.bookSlug) q.bookSlug = filter.bookSlug;
  if (filter.chapterId) q.chapterId = filter.chapterId;

  const docs = await ProblemModel.find(q).sort({ number: 1 }).lean();
  const counts = await solutionCounts(docs.map((d) => String(d._id)));
  return docs.map((d) => mapProblem(d, counts));
}

export async function getChaptersOverviewDB(sampleSize = 6) {
  await connectDB();
  const [chapters, books] = await Promise.all([
    ChapterModel.find().lean(),
    BookModel.find().lean(),
  ]);
  const bookMap = new Map(books.map((b) => [String(b._id), b]));

  chapters.sort((a, b) => {
    const ba = bookMap.get(String(a.bookId));
    const bb = bookMap.get(String(b.bookId));
    const ga = ba?.grade ?? 0;
    const gb = bb?.grade ?? 0;
    return ga !== gb ? ga - gb : a.number - b.number;
  });

  return Promise.all(
    chapters.map(async (c) => {
      const book = bookMap.get(String(c.bookId));
      const [total, docs] = await Promise.all([
        ProblemModel.countDocuments({ chapterId: c._id, status: "approved" }),
        ProblemModel.find({ chapterId: c._id, status: "approved" })
          .sort({ number: 1 })
          .limit(sampleSize)
          .lean(),
      ]);
      const counts = await solutionCounts(docs.map((d) => String(d._id)));
      return {
        chapterId: String(c._id),
        chapterNumber: c.number,
        titleKa: c.titleKa,
        titleEn: c.titleEn,
        bookSlug: c.bookSlug,
        bookTitleKa: book?.titleKa ?? "",
        bookTitleEn: book?.titleEn ?? "",
        total,
        problems: docs.map((d) => mapProblem(d, counts)),
      };
    })
  );
}

export async function getProblemByIdDB(id: string): Promise<Problem | null> {
  await connectDB();
  const p = await ProblemModel.findById(id).lean();
  if (!p || p.status !== "approved") return null;
  const counts = await solutionCounts([String(p._id)]);
  return mapProblem(p, counts);
}

export async function getSolutionsForProblemDB(
  problemId: string
): Promise<Solution[]> {
  await connectDB();
  const docs = await SolutionModel.find({ problemId }).sort({ upvotes: -1 }).lean();
  return docs.map((s) => ({
    id: String(s._id),
    problemId: String(s.problemId),
    authorName: s.authorName ?? "",
    contentKa: s.contentKa,
    contentEn: s.contentEn ?? s.contentKa,
    upvotes: s.upvotes ?? 0,
    createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : "",
  }));
}
