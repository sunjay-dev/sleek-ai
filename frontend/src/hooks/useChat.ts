import { useState, useEffect, useRef } from "react";
import type { Chat, Message } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
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

  const sendMessage = (text: string, file?: File | null) => {
    getToken().then((token) => {
      if (!token) return;
      if (!text.trim() && !file) return;

      const userMsg: Message = { text, isAi: false };
      setMessages((s) => [...s, userMsg]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentChatId = chatId;

      const handleChatUpdate = (chatIdToUse: string) => {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatIdToUse}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: text, model: selectedModel, file }),
          signal: controller.signal,
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to send message");
            return res.json();
          })
          .then((data) => {
            const aiText = data?.response ?? "Sorry, no response.";
            const aiMsg: Message = { text: aiText, isAi: true };
            setMessages((s) => [...s, aiMsg]);
          })
          .catch((err) => {
            if (err.name === "AbortError") {
              const stoppedMsg: Message = { text: "Generation stopped.", isAi: true };
              setMessages((s) => [...s, stoppedMsg]);
            } else {
              console.error(err);
              const errMsg: Message = { text: "Error: failed to contact server.", isAi: true };
              setMessages((s) => [...s, errMsg]);
            }
          })
          .finally(() => {
            setIsLoading(false);
            abortControllerRef.current = null;
          });
      };

      if (!currentChatId) {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: text }),
          signal: controller.signal,
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to create chat");
            return res.json();
          })
          .then((data) => {
            navigate(`/chat/${data.id}`, { replace: true });
            handleChatUpdate(data.id);
            setChats((chats) => [data, ...chats]);
          })
          .catch((err) => {
            console.error(err);
            const errMsg: Message = { text: "Error: failed to create chat.", isAi: true };
            setMessages((s) => [...s, errMsg]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        handleChatUpdate(currentChatId);
      }
    });
  };

  const resendLastUser = () => {
    const lastUser = [...messages].reverse().find((m) => !m.isAi);
    if (!lastUser) return;
    sendMessage(lastUser.text);
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
    chats,
    setChats,
  };
};
