import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import type { Chat, DeleteIntent } from "@/types";

export default function useChatDeletion(setChats: React.Dispatch<React.SetStateAction<Chat[]>>) {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [intent, setIntent] = useState<DeleteIntent>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDeleteChat = (chatId: string) => setIntent({ type: "single", chatId });

  const requestDeleteAll = () => setIntent({ type: "all" });

  const cancel = () => setIntent(null);

  const confirm = () => {
    if (!intent) return;

    setIsDeleting(true);

    getToken()
      .then((token) => {
        if (!token) throw new Error("No token");

        if (intent.type === "single") {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${intent.chatId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("Delete failed");

            setChats((prev) => prev.filter((c) => c.id !== intent.chatId));

            if (location.pathname.includes(intent.chatId)) {
              navigate("/");
            }
          });
        }

        if (intent.type === "all") {
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("Delete all failed");

            setChats([]);
            navigate("/");
          });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsDeleting(false);
        setIntent(null);
      });
  };

  return {
    intent,
    isDeleting,
    requestDeleteChat,
    requestDeleteAll,
    confirm,
    cancel,
  };
}
