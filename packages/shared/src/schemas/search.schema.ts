import z from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(3, { message: "Please enter at least 3 characters." }).max(50, { message: "Please enter less than 50 characters." }),
});

export const frontendSearchQuerySchema = z.object({
  q: z.string().trim().max(50, "Please enter less than 50 characters."),
});
