import { z } from "zod";
import { modelsId } from "../models.js";

export const uploadedFileSchema = z.object({
  fileUrl: z.url(),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
});

export const messageSchema = z.object({
  query: z.string().min(1, { message: "Please enter the valid query" }).max(3000, { message: "Please enter query less than 3000 characters." }),
  model: z.enum(modelsId, { message: "Please choose a correct model" }),

  messageFiles: z.array(uploadedFileSchema).optional().default([]),
});
