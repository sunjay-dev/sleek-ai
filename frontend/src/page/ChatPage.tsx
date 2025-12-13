import { useRef, useLayoutEffect } from "react";
import { MessagesContainer, InputContainer, Sidebar } from "@/components";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { messages, sendMessage, resendLastUser, isLoading, selectedModel, setSelectedModel, stopGeneration } = useChat();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-primary">
      <Sidebar />

      <main className="flex flex-col flex-1 min-h-0">
        <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto space-y-2 bg-primary md:no-scrollbar">
          <MessagesContainer messages={messages} sendMessage={sendMessage} onResend={resendLastUser} isLoading={isLoading} />
          <div ref={scrollRef} />
        </div>

        <InputContainer
          sendMessage={sendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          onStop={stopGeneration}
          onModelChange={(id) => setSelectedModel(id)}
        />
      </main>
    </div>
  );
}
