import { z } from "zod";
import { modelsId } from "../models.js";

export const querySchema = z.object({
  query: z.string().trim().min(1, { message: "Please enter the valid query" }).max(2000, { message: "Please keep messages under 2000 characters." }),
});

export const chatResponseSchema = z.object({
  query: z.string().trim().min(1, { message: "Please enter the valid query" }),
  model: z.enum(modelsId, { message: "Please choose a correct model" }),
});

export const chatRenameSchema = z.object({
  title: z.string().trim().min(1, { message: "Please enter a valid title" }).max(100, "Please enter title less than 100 characters."),
});

export const chatIdParamSchema = z.object({
  chatId: z.uuid({ message: "Please provide correct chatId" }),
});
