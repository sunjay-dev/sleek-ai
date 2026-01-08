import { useState, type Dispatch } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import type { Chat, DeleteChatIntent } from "@/types";

export default function useChatDeletion(setChats: Dispatch<React.SetStateAction<Chat[]>>) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [chatIntent, setchatIntent] = useState<DeleteChatIntent>(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);

  const requestDeleteChat = (chatId: string) => setchatIntent({ type: "single", chatId });

  const requestDeleteAllChat = () => setchatIntent({ type: "all" });

  const cancelDeleteChat = () => setchatIntent(null);

  const confirmDeleteChat = () => {
    if (!chatIntent) return;

    setIsDeletingChat(true);

    getToken()
      .then((token) => {
        if (!token) throw new Error("No token");

        if (chatIntent.type === "single") {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatIntent.chatId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("Delete failed");

            setChats((prev) => prev.filter((c) => c.id !== chatIntent.chatId));

            if (location.pathname.includes(chatIntent.chatId)) {
              navigate("/", { replace: true });
            }
          });
        }

        if (chatIntent.type === "all") {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("Delete all failed");

            setChats([]);
            navigate("/", { replace: true });
          });
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsDeletingChat(false);
        setchatIntent(null);
      });
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
