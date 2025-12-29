import { memo, useCallback, useEffect, useRef, useState } from "react";
import { UserMessage, ModelMessage, WelcomeScreen, MessageLoader } from "@/components";
import type { Message } from "@/types";

type Props = {
  messages: Message[];
  sendMessage: (text: string, file?: File | null) => void;
  onResend?: () => void;
  isGenerating: boolean;
  isFetchingMessages: boolean;
};

const MemoUserMessage = memo(UserMessage);
const MemoModelMessage = memo(ModelMessage);

export default function MessagesContainer({ messages, sendMessage, onResend, isGenerating, isFetchingMessages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isGenerating]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async (text: string, index: number) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);

      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error("Failed to copy text", e);
    }
  }, []);

  if (isFetchingMessages) return null;
  if (messages.length === 0) return <WelcomeScreen sendMessage={sendMessage} />;

  return (
    <div className="flex-1 pt-16 pb-6 px-4 mx-auto w-full max-w-svw sm:max-w-180 sm:mt-0 mt-2">
      <div className="space-y-6">
        {messages.map((message, index) => {
          const isCopied = copiedIndex === index;

          const isLastAIMessage = message.role === "ASSISTANT" && messages.slice(index + 1).every((m) => m.role !== "ASSISTANT");

          return (
            <div key={index}>
              {message.role === "ASSISTANT" ? (
                <MemoModelMessage
                  text={message.text}
                  isCopied={isCopied}
                  onCopy={() => handleCopy(message.text, index)}
                  onResend={isLastAIMessage ? onResend : undefined}
                />
              ) : (
                <MemoUserMessage text={message.text} isCopied={isCopied} onCopy={() => handleCopy(message.text, index)} />
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="pl-1">
            <MessageLoader />
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
