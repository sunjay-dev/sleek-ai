import { useState, useEffect } from "react";
import type { Chat } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { apiRequest } from "@/utils/api";

export default function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    async function handleFetchChats() {
      setIsFetchingChats(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("You must be logged in to fetch chats.");
        const data = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChats(data);
      } finally {
        setIsFetchingChats(false);
      }
    }
    handleFetchChats();
  }, [getToken]);

  const moveChatToTop = (id: string) => {
    setChats((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index <= 0) return prev;
      const newChats = [...prev];
      const [active] = newChats.splice(index, 1);
      newChats.unshift(active);
      return newChats;
    });
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    const token = await getToken();
    if (!token) throw new Error("You must be logged in to rename chat.");
    await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
      successMessage: "New title locked in.",
    });

    setChats((prev) => prev.map((c) => (c.id === chatId ? { id: c.id, title: newTitle } : c)));
  };

  return { chats, setChats, isFetchingChats, moveChatToTop, handleRenameChat };
}
