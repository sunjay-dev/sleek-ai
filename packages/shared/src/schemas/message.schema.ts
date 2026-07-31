import { z } from "zod";

export const uploadedFileSchema = z.object({
  fileUrl: z.url(),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
});

export const messageSchema = z
  .object({
    query: z.string().max(10000, { message: "Please enter query less than 10000 characters." }).default(""),
    messageFiles: z.array(uploadedFileSchema).optional().default([]),
  })
  .refine((data) => data.query.trim().length > 0 || data.messageFiles.length > 0, {
    message: "Please enter a message or attach a file",
    path: ["query"],
  });

export type UploadedFile = z.infer<typeof uploadedFileSchema>;

export type Message = z.infer<typeof messageSchema>;
