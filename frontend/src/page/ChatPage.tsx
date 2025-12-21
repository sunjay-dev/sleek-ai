import { useEffect, useState } from "react";
import { MessagesContainer, InputContainer, Sidebar, DeleteChat } from "@/components";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const {
    chats,
    setChats,
    messages,
    sendMessage,
    resendLastUser,
    isFetchingMessages,
    isGenerating,
    selectedModel,
    setSelectedModel,
    stopGeneration,
  } = useChat();

  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function getUserChats() {
      getToken().then((token) => {
        if (!token) return;

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch chats");
            return res.json();
          })
          .then((data) => setChats(data))
          .catch((error) => console.error("Failed to fetch chats", error));
      });
    }
    getUserChats();
  }, [getToken, setChats]);

  const confirmDelete = () => {
    if (!deleteChatId) return;

    setDeleting(true);

    getToken()
      .then((token) => {
        if (!token) throw new Error("No token");

        return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${deleteChatId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");

        setChats((prev) => prev.filter((c) => c.id !== deleteChatId));

        if (window.location.pathname.includes(deleteChatId)) navigate("/");
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setDeleting(false);
        setDeleteChatId(null);
      });
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-primary">
      <Sidebar chats={chats} setChats={setChats} onDeleteRequest={setDeleteChatId} />

      <main className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 bg-primary md:no-scrollbar">
          <MessagesContainer
            messages={messages}
            sendMessage={sendMessage}
            onResend={resendLastUser}
            isFetchingMessages={isFetchingMessages}
            isGenerating={isGenerating}
          />
        </div>

        <InputContainer
          sendMessage={sendMessage}
          isGenerating={isGenerating}
          selectedModel={selectedModel}
          onStop={stopGeneration}
          onModelChange={setSelectedModel}
        />
      </main>

      <DeleteChat open={deleteChatId !== null} onCancel={() => setDeleteChatId(null)} onConfirm={confirmDelete} loading={deleting} />
    </div>
  );
}
