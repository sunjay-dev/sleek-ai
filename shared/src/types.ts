import { modelsList } from "./models";
import { z } from "./index";
import { userPreferencesSchema } from "./schemas/user.schema";

export type Message = {
  id: string;
  text: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
};

export type Model = (typeof modelsList)[number];

export type Chat = {
  id: string;
  title: string | null;
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
