import { memo, useState } from "react";
import { UserMessageToolTip } from "@/components";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  text: string;
  isCopied: boolean;
  onCopy: () => void;
};

const CHAR_LIMIT = 300;

export default memo(function UserMessage({ text, isCopied, onCopy }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongText = text.length > CHAR_LIMIT;
  const displayedText = isLongText && !isExpanded ? text.slice(0, CHAR_LIMIT) + "..." : text;

  return (
    <div className="flex flex-col gap-2 justify-end items-end group">
      <div className="user-message-color text-primary border border-gray-300/20 px-3 py-2.5 rounded-tr-none rounded-2xl max-w-xs sm:max-w-lg relative transition-all">
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-medium opacity-70 hover:opacity-100 mb-2 ml-auto transition-opacity"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Read more <ChevronDown size={14} />
              </>
            )}
          </button>
        )}

        <p className="text-sm leading-normal whitespace-pre-wrap break-words">{displayedText}</p>
      </div>
      <UserMessageToolTip isCopied={isCopied} onCopy={onCopy} />
    </div>
  );
});
