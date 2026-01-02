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

export type Tab = "personalization" | "data" | "memory";

export type DeleteIntent = { type: "single"; chatId: string } | { type: "all" } | null;
