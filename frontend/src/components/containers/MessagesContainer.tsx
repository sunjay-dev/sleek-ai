import { useCallback, useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { UserMessage, ModelMessage } from "@/components";
import type { Message } from "@/types";
import { useLastAssistantId } from "@/hooks";

type Props = {
  messages: Message[];
  onResend?: () => void;
  isGenerating: boolean;
  isFetchingMessages: boolean;
};

const Header = () => <div className="h-16 sm:h-6" />;
const Footer = () => <div className="h-6" />;

export default function MessagesContainer({ messages, onResend, isGenerating, isFetchingMessages }: Props) {
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const lastAssistantId = useLastAssistantId(messages);

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
    <Virtuoso
      className="custom-scroll"
      ref={virtuosoRef}
      data={messages}
      overscan={{ main: 1500, reverse: 1500 }}
      followOutput={isGenerating ? "auto" : "smooth"}
      initialTopMostItemIndex={{ index: messages?.length - 1, align: "end" }}
      itemContent={(_, message) => {
        const isLastAI = message.id === lastAssistantId;
        const isCopied = copiedId === message.id;

        return (
          <div className="px-4 mx-auto w-full max-w-svw sm:max-w-180 py-3" style={{ contain: "content" }}>
            {message.role === "ASSISTANT" ? (
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
            )}
          </div>
        );
      }}
      components={{ Header, Footer }}
    />
  );
}
