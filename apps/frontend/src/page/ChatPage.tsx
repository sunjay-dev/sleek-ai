import { lazy, useState, useCallback } from "react";
import { Sidebar, LazyLoader } from "@/components";
import { useChat, useChatDeletion, useMessages, useIsMobile } from "@/hooks";
import type { Chat, Tab } from "@app/shared/types";
import "@/styles/modelMessage.css";
import "highlight.js/styles/atom-one-light.css";
import "katex/dist/katex.css";
import { useSearchParams } from "react-router-dom";

const SettingsModal = lazy(() => import("@/components/settings/SettingsModal.js"));
const SearchModal = lazy(() => import("@/components/search/SearchModal.js"));
const MessagesContainer = lazy(() => import("@/components/containers/MessagesContainer.js"));
const InputContainer = lazy(() => import("@/components/containers/InputContainer.js"));
const RenameChatModal = lazy(() => import("@/components/common/RenameChatModal.js"));
const DeleteModal = lazy(() => import("@/components/common/DeleteModal.js"));
const WelcomeScreen = lazy(() => import("@/components/WelcomeScreen.js"));

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { chats, setChats, moveChatToTop, isFetchingChats, handleRenameChat } = useChat();
  const { messages, sendMessage, resendLastUser, isGenerating, stopGeneration, isFetchingMessages } = useMessages({
    moveChatToTop,
    setChats,
  });
  const { chatIntent, isDeletingChat, requestDeleteChat, requestDeleteAllChat, confirmDeleteChat, cancelDeleteChat } = useChatDeletion(setChats);

  const isSettingsModalOpen = searchParams.get("modal") === "settings";
  const isSearchModalOpen = searchParams.get("modal") === "search";

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  const onRenameRequest = useCallback((chat: Chat) => {
    setActiveChat(chat);
    setIsRenameModalOpen(true);
  }, []);

  const openModal = useCallback(
    (modalName: string, tabName?: Tab) => {
      setSearchParams((prev) => {
        prev.set("modal", modalName);

        if (tabName) prev.set("tab", tabName);
        else prev.delete("tab");

        return prev;
      });
    },
    [setSearchParams],
  );

  const closeModal = useCallback(() => {
    setSearchParams((prev) => {
      prev.delete("modal");
      prev.delete("tab");

      return prev;
    });
  }, [setSearchParams]);

  const handleResend = useCallback(() => {
    resendLastUser();
  }, [resendLastUser]);

  const handleOpenUIAction = useCallback(
    (event: unknown) => {
      if (!event || typeof event !== "object") return;
      const ev = event as {
        type?: string;
        params?: Record<string, unknown>;
        humanFriendlyMessage?: string;
        formState?: Record<string, unknown>;
      };

      if (ev.type === "open_url") {
        const raw = ev.params?.url ?? ev.params?.href;
        if (typeof raw === "string" && raw && typeof window !== "undefined") {
          try {
            const parsed = new URL(raw, window.location.origin);
            if (parsed.protocol === "http:" || parsed.protocol === "https:") {
              window.open(parsed.href, "_blank", "noopener,noreferrer");
            }
          } catch {
            // Ignore malformed URLs.
          }
        }
        return;
      }

      let textToSend = ev.humanFriendlyMessage?.trim() || "";
      if (!textToSend && ev.params?.message) {
        textToSend = String(ev.params.message).trim();
      }
      if (!textToSend && ev.params?.text) {
        textToSend = String(ev.params.text).trim();
      }

      if (!textToSend && ev.formState && Object.keys(ev.formState).length > 0) {
        textToSend = Object.entries(ev.formState)
          .map(([key, val]) => `${key}: ${typeof val === "object" ? JSON.stringify(val) : val}`)
          .join(", ");
      }

      if (ev.params?.context !== undefined && ev.params?.context !== null) {
        const contextStr = typeof ev.params.context === "object" ? JSON.stringify(ev.params.context) : String(ev.params.context);
        textToSend = textToSend ? `${textToSend}\n[Context: ${contextStr}]` : contextStr;
      }

      if (textToSend) {
        sendMessage(textToSend);
      }
    },
    [sendMessage],
  );

  return (
    <div className="flex h-dvh overflow-hidden text-primary">
      <Sidebar
        isFetchingChats={isFetchingChats}
        chats={chats}
        setChats={setChats}
        onDeleteRequest={requestDeleteChat}
        openModal={openModal}
        onRenameRequest={onRenameRequest}
        onWelcomeScreen={messages?.length === 0 || isFetchingMessages}
      />

      <main className="flex flex-col flex-1 overflow-clip min-h-0 relative">
        {messages?.length === 0 && !isFetchingMessages ? (
          <LazyLoader>
            <div className="bg-light w-full h-full">
              <WelcomeScreen sendMessage={sendMessage} isGenerating={isGenerating} onStop={stopGeneration} />
            </div>
          </LazyLoader>
        ) : (
          <LazyLoader>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain bg-primary">
              <MessagesContainer
                messages={messages}
                onResend={handleResend}
                isFetchingMessages={isFetchingMessages}
                isGenerating={isGenerating}
                onAction={handleOpenUIAction}
              />
            </div>

            <InputContainer sendMessage={sendMessage} isGenerating={isGenerating} onStop={stopGeneration} autoFocus={!isMobile} />
          </LazyLoader>
        )}
      </main>

      {isSearchModalOpen && (
        <LazyLoader>
          <SearchModal onClose={closeModal} />
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
          <SettingsModal onClose={closeModal} DeleteChatIntent={requestDeleteAllChat} />
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
