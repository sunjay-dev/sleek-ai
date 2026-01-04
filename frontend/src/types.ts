export type Message = {
  text: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
};

export type Model = {
  id: string;
  name: string;
};

export type Chat = {
  id: string;
  title: string | null;
};

export type UserPreferences = {
  nickname: string;
  occupation: string;
  about: string;
  customInstructions: string;
};

export type UserMemory = {
  id: string;
  content: string;
};

export type Tab = "personalization" | "data" | "memory";

export type DeleteChatIntent = { type: "single"; chatId: string } | { type: "all" } | null;
