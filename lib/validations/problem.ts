import { z } from "zod";

export const createProblemSchema = z.object({
  bookSlug: z.string().min(1),
  chapterId: z.string().min(1),
  number: z.string().min(1),
  statementKa: z.string().min(5),
  statementEn: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  statementImages: z.array(z.string().url()).optional(),
});

export const createSolutionSchema = z.object({
  problemId: z.string().min(1),
  contentKa: z.string().min(5),
  contentEn: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const createCommentSchema = z.object({
  solutionId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
export type CreateSolutionInput = z.infer<typeof createSolutionSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
