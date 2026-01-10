import z from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(3, { message: "Please enter at least 3 character" }),
});
