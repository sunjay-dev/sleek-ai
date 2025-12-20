import { useEffect, useState } from "react";
import { MessagesContainer, InputContainer, Sidebar, DeleteChat } from "@/components";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface Chat {
  id: string;
  title: string | null;
}

export default function ChatPage() {
  const { messages, sendMessage, resendLastUser, isLoading, selectedModel, setSelectedModel, stopGeneration } = useChat();
  const [chats, setChats] = useState<Chat[]>([]);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) setChats(await res.json());
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    })();
  }, [getToken]);

  const confirmDelete = async () => {
    if (!deleteChatId) return;

    setDeleting(true);

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${deleteChatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      // update UI
      setChats((prev) => prev.filter((c) => c.id !== deleteChatId));

      if (window.location.pathname.includes(deleteChatId)) navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteChatId(null);
    }
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-primary">
      <Sidebar chats={chats} setChats={setChats} onDeleteRequest={setDeleteChatId} />

      <main className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 bg-primary md:no-scrollbar">
          <MessagesContainer messages={messages} sendMessage={sendMessage} onResend={resendLastUser} isLoading={isLoading} />
        </div>

        <InputContainer
          sendMessage={sendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          onStop={stopGeneration}
          onModelChange={setSelectedModel}
        />
      </main>

      <DeleteChat open={deleteChatId !== null} onCancel={() => setDeleteChatId(null)} onConfirm={confirmDelete} loading={deleting} />
    </div>
  );
}
