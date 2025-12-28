import { z } from "zod";

const modelsList = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3-32b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "moonshotai/kimi-k2-instruct-0905",
  "llama-3.3-70b-versatile",
];

export const querySchema = z.object({
  query: z.string().trim().min(1, { message: "Please enter the valid query" }),
});

export const chatResponseSchema = z.object({
  query: z.string().trim().min(1, { message: "Please enter the valid query" }),
  model: z.enum(modelsList, { message: "Please choose a correct model" }),
});

export const chatRenameSchema = z.object({
  title: z.string().trim().min(1, { message: "Please enter a valid title" }),
});

export const chatIdParamSchema = z.object({
  chatId: z.uuid({ message: "Please provide correct chatId" }),
});
