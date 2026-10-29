import { useCallback, useEffect, useRef, useState, memo } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { UserMessage, ModelMessage } from "@/components";
import type { Message } from "@app/shared/types";
import { useLastAssistantId } from "@/hooks";

type Props = {
  messages: Message[];
  onResend?: () => void;
  isGenerating: boolean;
  isFetchingMessages: boolean;
  onAction?: (action: unknown) => void;
};

const Header = () => <div className="h-16 sm:h-6" />;
const Footer = () => <div className="h-6" />;
const virtuosoComponents = { Header, Footer };

export default memo(function MessagesContainer({ messages, onResend, isGenerating, isFetchingMessages, onAction }: Props) {
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

  const itemContent = useCallback(
    (_: number, message: Message) => {
      const isLastAI = message.id === lastAssistantId;
      const isCopied = copiedId === message.id;

      return (
        <div className="px-5 sm:px-4 mx-auto w-full max-w-svw sm:max-w-180 py-4 sm:py-3" style={{ contain: "content" }}>
          {message.role === "ASSISTANT" ? (
            <ModelMessage
              key={message.id}
              text={message.text}
              status={message.status}
              isCopied={isCopied}
              onCopy={() => handleCopy(message.text, message.id)}
              onResend={isLastAI ? onResend : undefined}
              hideToolTip={isLastAI && isGenerating}
              isGenerating={isLastAI && isGenerating}
              onAction={onAction}
            />
          ) : (
            <UserMessage key={message.id} message={message} isCopied={isCopied} onCopy={() => handleCopy(message.text, message.id)} />
          )}
        </div>
      );
    },
    [lastAssistantId, copiedId, handleCopy, onResend, isGenerating, onAction],
  );

  if (isFetchingMessages) return null;

  return (
    <Virtuoso
      className="custom-scroll"
      ref={virtuosoRef}
      data={messages}
      overscan={{ main: 1500, reverse: 1500 }}
      followOutput={isGenerating ? "auto" : "smooth"}
      initialTopMostItemIndex={{ index: messages?.length - 1, align: "end" }}
      itemContent={itemContent}
      components={virtuosoComponents}
    />
  );
});
