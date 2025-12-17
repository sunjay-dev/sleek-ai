import { useState, useEffect, useRef } from "react";
import type { Message } from "../types";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem("selectedModel") || "openai/gpt-oss-120b";
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const { getToken } = useAuth();

  useEffect(() => {
    localStorage.setItem("selectedModel", selectedModel);
  }, [selectedModel]);

  const sendMessage = async (text: string, file?: File | null) => {
    const token = await getToken();

    if (!token) return;

    if (!text.trim() && !file) return;

    const userMsg: Message = { text, isAi: false };
    setMessages((s) => [...s, userMsg]);

    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let currentChatId = chatId;

      if (!currentChatId) {
        setIsLoading(true);
        const createChatRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: text }),
          signal: controller.signal,
        });

        if (!createChatRes.ok) {
          throw new Error("Failed to create chat.");
        }

        const { chatId: newChatId } = await createChatRes.json();
        currentChatId = newChatId;

        navigate(`/chat/${currentChatId}`, { replace: true });
      } else {
        setIsLoading(true);
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${currentChatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text, model: selectedModel, file }),
        signal: controller.signal,
      });

      const data = await res.json();
      const aiText = data?.response ?? "Sorry, no response.";
      const aiMsg: Message = { text: aiText, isAi: true };
      setMessages((s) => [...s, aiMsg]);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        const stoppedMsg: Message = { text: "Generation stopped.", isAi: true };
        setMessages((s) => [...s, stoppedMsg]);
      } else {
        console.error(err);
        const errMsg: Message = { text: "Error: failed to contact server.", isAi: true };
        setMessages((s) => [...s, errMsg]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const resendLastUser = async () => {
    const lastUser = [...messages].reverse().find((m) => !m.isAi);
    if (!lastUser) return;
    await sendMessage(lastUser.text);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    selectedModel,
    sendMessage,
    resendLastUser,
    stopGeneration,
    setSelectedModel,
  };
};
