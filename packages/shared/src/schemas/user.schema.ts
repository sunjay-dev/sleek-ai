import { z } from "zod";

export const userPreferencesSchema = z.object({
  nickname: z.string().trim().max(30, "Nickname must be at most 30 characters").nullable().optional(),
  occupation: z.string().trim().max(50, "Occupation must be at most 50 characters").nullable().optional(),
  about: z.string().trim().max(300, "About must be at most 300 characters").nullable().optional(),
  customInstructions: z.string().trim().max(500, "Custom instructions must be at most 500 characters").nullable().optional(),
});
