import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuth } from "@clerk/react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Chat, DeleteChatIntent } from "@app/shared/src/types";
import { apiRequest } from "@/utils/api";
import { validate } from "@/utils/validate";
import { chatIdParamSchema } from "@app/shared/src/schemas/chat.schema.js";

export default function useChatDeletion(setChats: Dispatch<SetStateAction<Chat[]>>) {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatIntent, setchatIntent] = useState<DeleteChatIntent>(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);

  const requestDeleteChat = (chatId: string) => setchatIntent({ type: "single", chatId });
  const requestDeleteAllChat = () => setchatIntent({ type: "all" });
  const cancelDeleteChat = () => setchatIntent(null);

  const confirmDeleteChat = async () => {
    if (!chatIntent) return;

    setIsDeletingChat(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("You must be logged in to delete chat.");

      if (chatIntent.type === "single") {
        const result = validate(chatIdParamSchema, { chatId: chatIntent.chatId }, "Please refresh the page and try again.");
        if (!result) {
          setIsDeletingChat(false);
          return;
        }

        await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${result.chatId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          successMessage: "Chat deleted successfully!",
        });

        setChats((prev) => prev.filter((c) => c.id !== chatIntent.chatId));

        if (location.pathname.includes(chatIntent.chatId)) {
          navigate("/", { replace: true });
        }
      }

      if (chatIntent.type === "all") {
        await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          successMessage: "Chats deleted successfully!",
        });

        setChats([]);
        navigate("/", { replace: true });
      }
    } finally {
      setIsDeletingChat(false);
      setchatIntent(null);
    }
  };

  return {
    chatIntent,
    isDeletingChat,
    requestDeleteChat,
    requestDeleteAllChat,
    confirmDeleteChat,
    cancelDeleteChat,
  };
}
