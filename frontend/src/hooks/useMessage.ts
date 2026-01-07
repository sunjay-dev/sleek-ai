import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import type { Chat, Message } from "@/types";

type Props = {
  moveChatToTop: (id: string) => void;
  setChats: Dispatch<SetStateAction<Chat[]>>;
};

export default function useMessages({ moveChatToTop, setChats }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { chatId } = useParams<{ chatId?: string }>();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const abortRef = useRef<AbortController | null>(null);
  const streamingIdRef = useRef<string | null>(null);
  const bufferRef = useRef("");
  const rafPendingRef = useRef(false);
  const justCreatedChatRef = useRef<string | null>(null);

  const sendMessage = async (text: string, model: string, file?: File | null) => {
    if (!text.trim()) return;

    const token = await getToken();
    if (!token) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "USER",
      text,
    };
    setMessages((m) => [...m, userMsg]);

    if (text.length > 2000) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "ASSISTANT",
          text: "Message too long (2000 char limit).",
        },
      ]);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const startStreaming = async (activeChatId: string) => {
      moveChatToTop(activeChatId);
      setIsGenerating(true);

      const assistantId = crypto.randomUUID();
      streamingIdRef.current = assistantId;
      bufferRef.current = "";

      setMessages((m) => [...m, { id: assistantId, role: "ASSISTANT", text: "" }]);

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${activeChatId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-client-timezone": userTimeZone,
        },
        body: JSON.stringify({ query: text, model, file }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.body) throw new Error("Streaming not supported");

          const reader = res.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            bufferRef.current += decoder.decode(value, { stream: true });

            if (!rafPendingRef.current) {
              rafPendingRef.current = true;
              requestAnimationFrame(() => {
                setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, text: bufferRef.current } : m)));
                rafPendingRef.current = false;
              });
            }
          }
        })
        .catch((err) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    text: err.name === "AbortError" ? "Generation stopped." : err.message || "Something went wrong.",
                  }
                : m,
            ),
          );
        })
        .finally(() => {
          setIsGenerating(false);
          abortRef.current = null;
          streamingIdRef.current = null;
        });
    };

    if (!chatId) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text }),
        signal: controller.signal,
      })
        .then((res) =>
          res.json().then((data) => {
            if (!res.ok) throw new Error(data.message);
            return data;
          }),
        )
        .then((data) => {
          justCreatedChatRef.current = data.id;
          setChats((c) => [data, ...c]);
          navigate(`/c/${data.id}`, { replace: true });

          return startStreaming(data.id);
        })
        .catch((err) => {
          setMessages((m) => [
            ...m,
            {
              id: crypto.randomUUID(),
              role: "ASSISTANT",
              text: err.name === "AbortError" ? "Generation stopped." : err.message,
            },
          ]);
        });
    } else {
      await startStreaming(chatId);
    }
  };

  const resendLastUser = (model: string) => {
    const lastUser = [...messages].reverse().find((m) => m.role === "USER");
    if (lastUser) sendMessage(lastUser.text, model);
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  };

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    if (justCreatedChatRef.current === chatId) {
      justCreatedChatRef.current = null;
      return;
    }

    async function handleGetAllChatMessages() {
      const token = await getToken();
      if (!token) return;

      setIsFetchingMessages(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${chatId}/message`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        navigate("/");
      } finally {
        setIsFetchingMessages(false);
      }
    }
    handleGetAllChatMessages();
  }, [chatId, getToken, navigate]);

  return {
    messages,
    sendMessage,
    resendLastUser,
    stopGeneration,
    isGenerating,
    isFetchingMessages,
  };
}
