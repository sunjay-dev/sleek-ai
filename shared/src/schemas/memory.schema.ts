import { z } from "zod";

export const memoryExtractionSchema = z.object({
  memories: z.array(z.string().min(5).max(300)),
});

export const memoryIdParamSchema = z.object({
  memoryId: z.uuid({ message: "Please provide correct memoryId" }),
});
