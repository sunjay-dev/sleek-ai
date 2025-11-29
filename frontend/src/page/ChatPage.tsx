import { useRef, useEffect } from "react";
import { MessagesContainer, InputContainer, Sidebar } from "@/components";
import { models } from "@/data/models";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const {
    messages,
    sendMessage,
    resendLastUser,
    isLoading,
    selectedModel,
    setSelectedModel,
    stopGeneration
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-primary">
      <Sidebar />
      <main className="flex flex-col flex-1 ">

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-primary no-scrollbar">
          <MessagesContainer
            messages={messages}
            sendMessage={sendMessage}
            onResend={resendLastUser}
            isLoading={isLoading}
          />
          <div ref={messagesEndRef} />
        </div>

        <InputContainer
          sendMessage={sendMessage}
          isLoading={isLoading}
          models={models}
          selectedModel={selectedModel}
          onStop={stopGeneration}
          onModelChange={handleModelChange}
        />
      </main>
    </div>
  );
}