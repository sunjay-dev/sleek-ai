import { useCallback, useEffect, useRef, useState } from "react";
import { UserMessage, ModelMessage } from "@/components";
import type { Message } from "@/types";
import { useLastAssistantId } from "@/hooks";

type Props = {
  messages: Message[];
  onResend?: () => void;
  isGenerating: boolean;
  isFetchingMessages: boolean;
};

export default function MessagesContainer({ messages, onResend, isGenerating, isFetchingMessages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  const lastAssistantId = useLastAssistantId(messages);

  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!bottomRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      shouldAutoScrollRef.current = isAtBottom;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!bottomRef.current) return;

    if (shouldAutoScrollRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: isGenerating ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [messages.length, isGenerating]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async (text: string, id: string) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopiedId(id);

    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(() => setCopiedId(null), 2000);
  }, []);

  if (isFetchingMessages) return null;

  return (
    <div className="px-4 mx-auto w-full pb-6 max-w-svw sm:max-w-180 sm:pt-6 pt-16">
      <div className="space-y-6">
        {messages.map((message) => {
          const isLastAI = message.id === lastAssistantId;
          const isCopied = copiedId === message.id;

          return message.role === "ASSISTANT" ? (
            <ModelMessage
              key={message.id}
              text={message.text}
              isCopied={isCopied}
              onCopy={() => handleCopy(message.text, message.id)}
              onResend={isLastAI ? onResend : undefined}
              hideToolTip={isLastAI && isGenerating}
              isGenerating={isLastAI && isGenerating}
            />
          ) : (
            <UserMessage key={message.id} text={message.text} isCopied={isCopied} onCopy={() => handleCopy(message.text, message.id)} />
          );
        })}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
}
