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

  return { chats, setChats, isFetchingChats, moveChatToTop };
}
