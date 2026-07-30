import { z } from "zod";

export const createBookingSchema = z.object({
  tutorId: z.string().min(1),
  startAt: z.string().datetime(),
  durationMin: z.number().int().positive().default(60),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
