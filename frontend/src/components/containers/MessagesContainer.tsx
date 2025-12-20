import { memo, useCallback, useEffect, useRef, useState } from "react";
import { UserMessage, ModelMessage, WelcomeScreen, MessageLoader } from "@/components";
import type { Message } from "@/types";

type Props = {
  messages: Message[];
  sendMessage: (text: string, file?: File | null) => void;
  onResend?: () => void;
  isLoading: boolean;
};

const MemoUserMessage = memo(UserMessage);
const MemoModelMessage = memo(ModelMessage);

export default function MessagesContainer({ messages, sendMessage, onResend, isLoading }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);

      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedIndex(null), 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  const handleCopyMessage = useCallback((text: string, index: number) => {
    handleCopy(text, index);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex-1 py-6 px-4 sm:px-2 mx-auto w-full max-w-svw sm:max-w-180 ${messages.length === 0 ? "h-[-webkit-fill-available]" : ""}`}
    >
      {messages.length === 0 ? (
        <WelcomeScreen sendMessage={sendMessage} />
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.isAi ? (
                <MemoModelMessage
                  key={index}
                  text={message.text}
                  isCopied={copiedIndex === index}
                  onCopy={() => handleCopyMessage(message.text, index)}
                  onResend={onResend}
                />
              ) : (
                <MemoUserMessage
                  key={index}
                  text={message.text}
                  isCopied={copiedIndex === index}
                  onCopy={() => handleCopyMessage(message.text, index)}
                />
              )}
            </div>
          ))}
          {isLoading && <MessageLoader />}
        </div>
      )}
    </div>
  );
}
