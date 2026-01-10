import { lazy, useState } from "react";
import { Sidebar, LazyLoader } from "@/components";
import { useChat, useChatDeletion, useModel, useMessages, useIsMobile } from "@/hooks";
import type { Chat } from "@/types";
import "@/styles/modelMessage.css";
import "highlight.js/styles/atom-one-light.css";
import "katex/dist/katex.css";

const SettingsModal = lazy(() => import("@/components/settings/SettingsModal.tsx"));
const SearchModal = lazy(() => import("@/components/search/SearchModal.tsx"));
const MessagesContainer = lazy(() => import("@/components/containers/MessagesContainer.tsx"));
const InputContainer = lazy(() => import("@/components/containers/InputContainer.tsx"));
const RenameChatModal = lazy(() => import("@/components/common/RenameChatModal.tsx"));
const DeleteModal = lazy(() => import("@/components/common/DeleteModal.tsx"));
const WelcomeScreen = lazy(() => import("@/components/WelcomeScreen.tsx"));

export default function ChatPage() {
  const isMobile = useIsMobile();
  const { chats, setChats, moveChatToTop, isFetchingChats, handleRenameChat } = useChat();
  const { messages, sendMessage, resendLastUser, isGenerating, stopGeneration, isFetchingMessages } = useMessages({ moveChatToTop, setChats });
  const { chatIntent, isDeletingChat, requestDeleteChat, requestDeleteAllChat, confirmDeleteChat, cancelDeleteChat } = useChatDeletion(setChats);
  const { selectedModel, setSelectedModel } = useModel();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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
        setIsSearchModalOpen={setIsSearchModalOpen}
        onRenameRequest={onRenameRequest}
        onWelcomeScreen={messages.length === 0 || isFetchingMessages}
      />

      <main className="flex flex-col flex-1 overflow-clip min-h-0 relative">
        {messages.length === 0 && !isFetchingMessages ? (
          <LazyLoader>
            <div className="bg-light w-full h-full">
              <WelcomeScreen
                sendMessage={sendMessage}
                isGenerating={isGenerating}
                selectedModel={selectedModel}
                onStop={stopGeneration}
                onModelChange={setSelectedModel}
              />
            </div>
          </LazyLoader>
        ) : (
          <LazyLoader>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain bg-primary">
              <MessagesContainer
                messages={messages}
                onResend={() => resendLastUser(selectedModel)}
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
              autoFocus={!isMobile}
            />
          </LazyLoader>
        )}
      </main>

      {isSearchModalOpen && (
        <LazyLoader>
          <SearchModal onClose={() => setIsSearchModalOpen(false)} />
        </LazyLoader>
      )}

      {isRenameModalOpen && (
        <LazyLoader>
          <RenameChatModal
            onClose={() => setIsRenameModalOpen(false)}
            currentTitle={activeChat?.title ?? ""}
            onRename={(newTitle) => {
              if (!activeChat) return;
              handleRenameChat(activeChat.id, newTitle);
              setIsRenameModalOpen(false);
            }}
          />
        </LazyLoader>
      )}

      {isSettingsModalOpen && (
        <LazyLoader>
          <SettingsModal onClose={() => setIsSettingsModalOpen(false)} DeleteChatIntent={requestDeleteAllChat} />
        </LazyLoader>
      )}

      {chatIntent && (
        <LazyLoader>
          <DeleteModal
            variant={chatIntent.type === "all" ? "delete-all" : "delete-chat"}
            loading={isDeletingChat}
            onCancel={cancelDeleteChat}
            onConfirm={confirmDeleteChat}
          />
        </LazyLoader>
      )}
    </div>
  );
}
