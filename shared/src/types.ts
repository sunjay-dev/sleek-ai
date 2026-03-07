import { modelsList } from "./models";
import { z } from "./index";
import { userPreferencesSchema } from "./schemas/user.schema";
import { uploadedFileSchema } from "./schemas/message.schema";

export type UploadedFile = z.infer<typeof uploadedFileSchema>;

export type Message = {
  id: string;
  text: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  messageFiles?: UploadedFile[] | null;
  status?: string | null;
};

export type Model = (typeof modelsList)[number];

export type Chat = {
  id: string;
  title: string | null;
  ragStatus?: "IDLE" | "PROCESSING" | "COMPLETED" | "FAILED";
  isRag?: boolean;
};

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export type UserMemory = {
  id: string;
  content: string;
};

export type SearchResult = {
  text: string;
  createdAt: string;
  chatId: string;
  chat: {
    title: string;
  };
};

export type Tab = "personalization" | "data" | "memory";

export type DeleteChatIntent = { type: "single"; chatId: string } | { type: "all" } | null;
