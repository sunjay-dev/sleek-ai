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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedIndex(null), 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  }, []);

  if (isFetchingMessages) return null;
  if (messages.length === 0) return <WelcomeScreen sendMessage={sendMessage} />;

  return (
    <div ref={containerRef} className="flex-1 py-6 px-4 sm:px-2 mx-auto w-full max-w-svw sm:max-w-180">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === "ASSISTANT" ? (
              <MemoModelMessage
                text={message.text}
                isCopied={copiedIndex === index}
                onCopy={() => handleCopy(message.text, index)}
                onResend={onResend}
              />
            ) : (
              <MemoUserMessage text={message.text} isCopied={copiedIndex === index} onCopy={() => handleCopy(message.text, index)} />
            )}
          </div>
        ))}
        {isGenerating && <MessageLoader />}
      </div>
    </div>
  );
}
