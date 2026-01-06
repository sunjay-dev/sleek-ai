import { lazy, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MessagesContainer, InputContainer, Sidebar, ErrorPage } from "@/components";
import { useChat, useChatDeletion, useModel, useMessages } from "@/hooks";
import type { Chat } from "@/types";

const SettingsModal = lazy(() => import("@/components/settings/SettingsModal.tsx"));
const RenameChatModal = lazy(() => import("@/components/common/RenameChatModal.tsx"));
const DeleteModal = lazy(() => import("@/components/common/DeleteModal.tsx"));

export default function ChatPage() {
  const { chats, setChats, moveChatToTop, isFetchingChats, handleRenameChat } = useChat();
  const { messages, sendMessage, resendLastUser, isGenerating, stopGeneration, isFetchingMessages } = useMessages({ moveChatToTop, setChats });
  const { chatIntent, isDeletingChat, requestDeleteChat, requestDeleteAllChat, confirmDeleteChat, cancelDeleteChat } = useChatDeletion(setChats);
  const { selectedModel, setSelectedModel } = useModel();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const onRenameRequest = (chat: Chat) => {
    setActiveChat(chat);
    setIsRenameModalOpen(true);
  };

  return (
    <div className="flex h-dvh overflow-hidden text-primary">
      <Sidebar
        isFetchingChats={isFetchingChats}
        chats={chats}
        setChats={setChats}
        onDeleteRequest={requestDeleteChat}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        onRenameRequest={onRenameRequest}
      />

      <main className="flex flex-col flex-1 min-h-0">
        <div id="messageContainer" className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain space-y-2 bg-primary">
          <MessagesContainer
            messages={messages}
            onResend={() => resendLastUser(selectedModel)}
            sendMessage={(text) => sendMessage(text, selectedModel)}
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

      {isRenameModalOpen && (
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Suspense fallback={null}>
            <RenameChatModal
              onClose={() => setIsRenameModalOpen(false)}
              currentTitle={activeChat?.title ?? ""}
              onRename={(newTitle) => {
                if (!activeChat) return;
                handleRenameChat(activeChat.id, newTitle);
                setIsRenameModalOpen(false);
              }}
            />
          </Suspense>
        </ErrorBoundary>
      )}

      {isSettingsModalOpen && (
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Suspense fallback={null}>
            <SettingsModal onClose={() => setIsSettingsModalOpen(false)} DeleteChatIntent={requestDeleteAllChat} />
          </Suspense>
        </ErrorBoundary>
      )}

      {chatIntent && (
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Suspense fallback={null}>
            <DeleteModal
              variant={chatIntent.type === "all" ? "delete-all" : "delete-chat"}
              loading={isDeletingChat}
              onCancel={cancelDeleteChat}
              onConfirm={confirmDeleteChat}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
