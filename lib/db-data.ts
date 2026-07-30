import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import BookModel from "@/models/Book";
import ChapterModel from "@/models/Chapter";
import ProblemModel from "@/models/Problem";
import SolutionModel from "@/models/Solution";
import BookingModel from "@/models/Booking";
import TutorProfileModel from "@/models/TutorProfile";
import CommentModel from "@/models/Comment";
import type { Problem, Solution, Tutor } from "@/lib/mock-data";

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
  if (!isValidObjectId(chapterId)) return null;
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

async function gradeSlugsMap() {
  await connectDB();
  const books = await BookModel.find({}, { slug: 1, grade: 1 }).lean();
  const gradeBySlug = new Map(books.map((b) => [b.slug, b.grade as number]));
  return gradeBySlug;
}

export async function getGradesDB(): Promise<number[]> {
  await connectDB();
  const grades = await BookModel.distinct("grade");
  return (grades as number[]).sort((a, b) => a - b);
}

export async function getProblemsDB(filter: {
  bookSlug?: string;
  chapterId?: string;
  grade?: number;
  q?: string;
}): Promise<Problem[]> {
  await connectDB();
  const q: Record<string, unknown> = { status: "approved" };
  if (filter.bookSlug) q.bookSlug = filter.bookSlug;
  if (filter.chapterId) q.chapterId = filter.chapterId;
  if (filter.grade) {
    const books = await BookModel.find({ grade: filter.grade }, { slug: 1 }).lean();
    q.bookSlug = { $in: books.map((b) => b.slug) };
  }
  if (filter.q) {
    const re = new RegExp(filter.q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    q.$or = [{ statementKa: re }, { statementEn: re }, { number: re }];
  }

  const docs = await ProblemModel.find(q).sort({ number: 1 }).lean();
  const counts = await solutionCounts(docs.map((d) => String(d._id)));
  const gradeBySlug = await gradeSlugsMap();
  return docs.map((d) => ({
    ...mapProblem(d, counts),
    grade: gradeBySlug.get(d.bookSlug),
  }));
}

export async function getChaptersOverviewDB(sampleSize = 6, grade?: number) {
  await connectDB();
  const [chapters, books] = await Promise.all([
    ChapterModel.find().lean(),
    BookModel.find().lean(),
  ]);
  const bookMap = new Map(books.map((b) => [String(b._id), b]));

  const filteredChapters = grade
    ? chapters.filter((c) => bookMap.get(String(c.bookId))?.grade === grade)
    : chapters;

  filteredChapters.sort((a, b) => {
    const ba = bookMap.get(String(a.bookId));
    const bb = bookMap.get(String(b.bookId));
    const ga = ba?.grade ?? 0;
    const gb = bb?.grade ?? 0;
    return ga !== gb ? ga - gb : a.number - b.number;
  });

  return Promise.all(
    filteredChapters.map(async (c) => {
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
        grade: book?.grade,
        total,
        problems: docs.map((d) => ({ ...mapProblem(d, counts), grade: book?.grade })),
      };
    })
  );
}

export type Topic = {
  chapterId: string;
  chapterNumber: number;
  titleKa: string;
  titleEn: string;
  bookSlug: string;
  bookTitleKa: string;
  bookTitleEn: string;
  grade: number;
  problemCount: number;
};

export async function getTopicsDB(grade?: number): Promise<Topic[]> {
  await connectDB();
  const [chapters, books] = await Promise.all([
    ChapterModel.find().lean(),
    BookModel.find().lean(),
  ]);
  const bookMap = new Map(books.map((b) => [String(b._id), b]));

  const filtered = chapters.filter((c) => {
    const book = bookMap.get(String(c.bookId));
    return book && (!grade || book.grade === grade);
  });

  filtered.sort((a, b) => {
    const ba = bookMap.get(String(a.bookId));
    const bb = bookMap.get(String(b.bookId));
    const ga = ba?.grade ?? 0;
    const gb = bb?.grade ?? 0;
    return ga !== gb ? ga - gb : a.number - b.number;
  });

  return Promise.all(
    filtered.map(async (c) => {
      const book = bookMap.get(String(c.bookId))!;
      const problemCount = await ProblemModel.countDocuments({
        chapterId: c._id,
        status: "approved",
      });
      return {
        chapterId: String(c._id),
        chapterNumber: c.number,
        titleKa: c.titleKa,
        titleEn: c.titleEn,
        bookSlug: c.bookSlug,
        bookTitleKa: book.titleKa,
        bookTitleEn: book.titleEn,
        grade: book.grade,
        problemCount,
      };
    })
  );
}

export async function getProblemByIdDB(
  id: string,
  viewerId?: string
): Promise<(Problem & { status?: string; rejectionReason?: string }) | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const p = await ProblemModel.findById(id).lean();
  if (!p) return null;
  const isOwner = viewerId && String(p.authorId) === viewerId;
  if (p.status !== "approved" && !isOwner) return null;
  const counts = await solutionCounts([String(p._id)]);
  const gradeBySlug = await gradeSlugsMap();
  return {
    ...mapProblem(p, counts),
    grade: gradeBySlug.get(p.bookSlug),
    status: p.status,
    rejectionReason: p.rejectionReason,
  };
}

export async function getMyProblemsDB(authorId: string) {
  await connectDB();
  const docs = await ProblemModel.find({ authorId }).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({
    id: String(d._id),
    number: d.number,
    statementKa: d.statementKa,
    statementEn: d.statementEn ?? d.statementKa,
    bookSlug: d.bookSlug,
    status: d.status as "pending" | "approved" | "rejected",
    rejectionReason: d.rejectionReason as string | undefined,
  }));
}

export type Booking = {
  id: string;
  tutorName: string;
  startAt: string;
  durationMin: number;
  status: string;
  priceGEL: number;
};

export async function getMyBookingsDB(
  userId: string,
  tutorProfileId?: string
): Promise<Booking[]> {
  await connectDB();
  const or: Record<string, unknown>[] = [{ studentId: userId }];
  if (tutorProfileId) or.push({ tutorId: tutorProfileId });

  const docs = await BookingModel.find({ $or: or }).sort({ startAt: 1 }).lean();
  const tutorIds = Array.from(new Set(docs.map((d) => String(d.tutorId))));
  const tutors = await TutorProfileModel.find(
    { _id: { $in: tutorIds } },
    { name: 1 }
  ).lean();
  const tutorNameById = new Map(tutors.map((t) => [String(t._id), t.name]));

  return docs.map((d) => ({
    id: String(d._id),
    tutorName: tutorNameById.get(String(d.tutorId)) ?? "",
    startAt: d.startAt ? new Date(d.startAt).toISOString() : "",
    durationMin: d.durationMin,
    status: d.status,
    priceGEL: d.priceGEL,
  }));
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

export type CommentItem = {
  id: string;
  solutionId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export async function getCommentsForSolutionsDB(
  solutionIds: string[]
): Promise<Map<string, CommentItem[]>> {
  const byId = new Map<string, CommentItem[]>();
  if (solutionIds.length === 0) return byId;
  await connectDB();
  const docs = await CommentModel.find({ solutionId: { $in: solutionIds } })
    .sort({ createdAt: 1 })
    .lean();
  for (const c of docs) {
    const sid = String(c.solutionId);
    const item: CommentItem = {
      id: String(c._id),
      solutionId: sid,
      authorName: c.authorName ?? "",
      content: c.content,
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : "",
    };
    const list = byId.get(sid) ?? [];
    list.push(item);
    byId.set(sid, list);
  }
  return byId;
}

function mapTutor(t: {
  _id: unknown;
  name: string;
  bio?: string;
  subjects?: string[];
  hourlyRateGEL: number;
  rating?: number;
  reviewCount?: number;
  avatarSeed?: string;
  approved?: boolean;
}): Tutor {
  return {
    id: String(t._id),
    name: t.name,
    bio: t.bio ?? "",
    subjects: t.subjects ?? [],
    hourlyRateGEL: t.hourlyRateGEL,
    rating: t.rating ?? 0,
    reviewCount: t.reviewCount ?? 0,
    avatarSeed: t.avatarSeed ?? t.name,
    approved: t.approved ?? false,
  };
}

export async function getTutorsDB(): Promise<Tutor[]> {
  await connectDB();
  const docs = await TutorProfileModel.find({ approved: true })
    .sort({ rating: -1 })
    .lean();
  return docs.map(mapTutor);
}

export type UpcomingSlotDay = {
  date: string;
  times: { iso: string; hour: number; minute: number }[];
};

function computeUpcomingSlots(
  availability: { dayOfWeek: number; startHour: number; endHour: number; durationMin?: number }[],
  days = 7
): UpcomingSlotDay[] {
  const now = new Date();
  const out: UpcomingSlotDay[] = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const dow = day.getDay();
    const times: UpcomingSlotDay["times"] = [];
    for (const slot of availability.filter((a) => a.dayOfWeek === dow)) {
      const step = slot.durationMin && slot.durationMin > 0 ? slot.durationMin : 60;
      for (let m = slot.startHour * 60; m < slot.endHour * 60; m += step) {
        const hour = Math.floor(m / 60);
        const minute = m % 60;
        const iso = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          hour,
          minute
        ).toISOString();
        if (new Date(iso).getTime() > now.getTime()) {
          times.push({ iso, hour, minute });
        }
      }
    }
    out.push({ date: day.toISOString(), times });
  }
  return out;
}

export async function getTutorByIdDB(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const t = await TutorProfileModel.findById(id).lean();
  if (!t || !t.approved) return null;
  const availability = (t.availability ?? []) as {
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    durationMin?: number;
  }[];
  return {
    ...mapTutor(t),
    upcomingSlots: computeUpcomingSlots(availability),
  };
}
