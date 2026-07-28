import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(6).max(72),
    role: z.enum(["student", "tutor"]).default("student"),
    bio: z.string().max(600).optional(),
    subjects: z.array(z.string().min(1)).optional(),
    hourlyRateGEL: z.coerce.number().positive().optional(),
    yearsExperience: z.coerce.number().int().min(0).max(80).optional(),
    experience: z.string().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== "tutor") return;
    if (!data.subjects || data.subjects.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one subject is required",
        path: ["subjects"],
      });
    }
    if (!data.hourlyRateGEL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hourly rate is required",
        path: ["hourlyRateGEL"],
      });
    }
    if (data.yearsExperience === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Years of experience is required",
        path: ["yearsExperience"],
      });
    }
    if (!data.experience || data.experience.trim().length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe your teaching experience (min 20 characters)",
        path: ["experience"],
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
