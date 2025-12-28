import { useState, useEffect } from "react";
import type { Chat } from "@/types";
import { useAuth } from "@clerk/clerk-react";

export default function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    setIsFetchingChats(true);
    getToken()
      .then((token) => {
        if (!token) return;
        return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(async (res) => {
        if (!res?.ok) throw new Error("Failed to fetch chats");
        return res.json();
      })
      .then((data) => data && setChats(data))
      .catch((err) => console.error("Failed to fetch chats", err))
      .finally(() => setIsFetchingChats(false));
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
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error("Failed to rename chat");
      const updatedChat: Chat = await res.json();

      // update frontend state
      setChats((prev) => prev.map((c) => (c.id === chatId ? updatedChat : c)));
    } catch (err) {
      console.error(err);
    }
  };

  return { chats, setChats, isFetchingChats, moveChatToTop, handleRenameChat };
}
