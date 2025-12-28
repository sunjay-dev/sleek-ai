import { useState, useEffect, useRef } from "react";
import type { Message } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";

export default function useMessages(moveChatToTop: (id: string) => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const newlyCreatedChatRef = useRef<string | null>(null);

  const { chatId } = useParams<{ chatId?: string }>();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = (text: string, selectedModel: string, file?: File | null) => {
    getToken().then((token) => {
      if (!token || (!text.trim() && !file)) return;

      const userMsg: Message = { text, role: "USER" };
      setMessages((s) => [...s, userMsg]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const handleChatUpdate = (chatIdToUse: string) => {
        setIsGenerating(true);
        moveChatToTop(chatIdToUse);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatIdToUse}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ query: text, model: selectedModel, file }),
          signal: controller.signal,
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            const aiMsg: Message = { text: data ?? "Sorry, no response.", role: "ASSISTANT" };
            setMessages((s) => [...s, aiMsg]);
          })
          .catch((err) => {
            const msg: Message = {
              text: err.name === "AbortError" ? "Generation stopped." : err.message,
              role: "ASSISTANT",
            };
            setMessages((s) => [...s, msg]);
          })
          .finally(() => {
            setIsGenerating(false);
            abortControllerRef.current = null;
          });
      };

      if (!chatId) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ query: text }),
          signal: controller.signal,
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Something went wrong");
            newlyCreatedChatRef.current = data.id;
            handleChatUpdate(data.id);
          })
          .catch((err) => {
            const msg: Message = { text: err.message, role: "ASSISTANT" };
            setMessages((s) => [...s, msg]);
          });
      } else handleChatUpdate(chatId);
    });
  };

  const resendLastUser = (selectedModel: string) => {
    const lastUser = [...messages].reverse().find((m) => m.role === "USER");
    if (!lastUser) return;
    sendMessage(lastUser.text, selectedModel);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    if (newlyCreatedChatRef.current === chatId) {
      newlyCreatedChatRef.current = null;
      return;
    }

    getToken().then((token) => {
      if (!token) return;
      setIsFetchingMessages(true);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to load messages");
          setMessages(data.messages || []);
        })
        .catch((err) => {
          console.error(err);
          navigate("/");
        })
        .finally(() => setIsFetchingMessages(false));
    });
  }, [chatId, getToken, navigate]);

  return { messages, sendMessage, resendLastUser, stopGeneration, isGenerating, isFetchingMessages };
}
