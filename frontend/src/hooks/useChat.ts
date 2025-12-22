import { useState, useEffect, useRef } from "react";
import type { Chat, Message } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const newlyCreatedChatRef = useRef<string | null>(null);

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

      const userMsg: Message = { text, role: "USER" };
      setMessages((s) => [...s, userMsg]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentChatId = chatId;

      const handleChatUpdate = (chatIdToUse: string) => {
        setIsGenerating(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatIdToUse}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: text, model: selectedModel, file }),
          signal: controller.signal,
        })
          .then(async (res) => {
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

            return data;
          })
          .then((data) => {
            const aiText = data ?? "Sorry, no response.";
            const aiMsg: Message = { text: aiText, role: "ASSISTANT" };
            setMessages((s) => [...s, aiMsg]);
          })
          .catch((err) => {
            if (err.name === "AbortError") {
              const stoppedMsg: Message = { text: "Generation stopped.", role: "ASSISTANT" };
              setMessages((s) => [...s, stoppedMsg]);
            } else {
              console.error(err);
              const errMsg: Message = { text: err.message, role: "ASSISTANT" };
              setMessages((s) => [...s, errMsg]);
            }
          })
          .finally(() => {
            setIsGenerating(false);
            abortControllerRef.current = null;
          });
      };

      if (!currentChatId) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: text }),
          signal: controller.signal,
        })
          .then(async (res) => {
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Something went wrong, Please try again later.");

            return data;
          })
          .then((data) => {
            navigate(`/c/${data.id}`, { replace: true });
            handleChatUpdate(data.id);
            newlyCreatedChatRef.current = data.id;
            setChats((chats) => [data, ...chats]);
          })
          .catch((err) => {
            console.error(err);
            const errMsg: Message = { text: err.message, role: "ASSISTANT" };
            setMessages((s) => [...s, errMsg]);
          });
      } else {
        handleChatUpdate(currentChatId);
      }
    });
  };

  const resendLastUser = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "USER");

    if (!lastUser) return;

    sendMessage(lastUser.text);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) throw new Error(data.message || "Failed to load messages, Please try again later.");

          return data;
        })
        .then((data) => {
          setMessages(data.messages || []);
        })
        .catch((err) => {
          console.error(err);
          navigate("/");
        })
        .finally(() => setIsFetchingMessages(false));
    });
  }, [chatId, getToken, navigate]);

  return {
    messages,
    isGenerating,
    isFetchingMessages,
    selectedModel,
    sendMessage,
    resendLastUser,
    stopGeneration,
    setSelectedModel,
    chats,
    setChats,
  };
};
