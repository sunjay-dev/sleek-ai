import { lazy, Suspense, useState } from "react";
import { MessagesContainer, InputContainer, Sidebar, DeleteModal } from "@/components";
import { useChat, useChatDeletion, useModel, useMessages } from "@/hooks";

const SettingsModal = lazy(() => import("@/components/settings/SettingsModal.tsx"));

export default function ChatPage() {
  const { chats, setChats, moveChatToTop, isFetchingChats } = useChat();
  const { messages, sendMessage, resendLastUser, isGenerating, stopGeneration, isFetchingMessages } = useMessages(moveChatToTop);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { intent, isDeleting, requestDeleteChat, requestDeleteAll, confirm, cancel } = useChatDeletion(setChats);
  const { selectedModel, setSelectedModel } = useModel();

  return (
    <div className="flex h-dvh overflow-hidden text-primary">
      <Sidebar
        isFetchingChats={isFetchingChats}
        chats={chats}
        setChats={setChats}
        onDeleteRequest={requestDeleteChat}
        setIsSettingsOpen={setIsSettingsOpen}
      />

      <main className="flex flex-col flex-1 min-h-0">
        <div id="messageContainer" className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain space-y-2 bg-primary">
          <MessagesContainer
            messages={messages}
            onResend={() => resendLastUser(selectedModel)}
            sendMessage={(text, file) => sendMessage(text, selectedModel, file)}
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

      {isSettingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal onClose={() => setIsSettingsOpen(false)} requestDeleteAll={requestDeleteAll} />
        </Suspense>
      )}

      {intent && (
        <DeleteModal variant={intent.type === "all" ? "delete-all" : "delete-chat"} loading={isDeleting} onCancel={cancel} onConfirm={confirm} />
      )}
    </div>
  );
}
