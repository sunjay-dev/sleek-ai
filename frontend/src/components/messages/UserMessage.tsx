import { memo, useState } from "react";
import { UserMessageToolTip } from "@/components";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { Message } from "@app/shared/src/types";

type Props = {
  message: Message;
  isCopied: boolean;
  onCopy: () => void;
};

const CHAR_LIMIT = 300;

const isImageUrl = (url: string) => {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
};

export default memo(function UserMessage({ message, isCopied, onCopy }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { text, messageFiles } = message;

  const downloadPdf = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isLongText = text.length > CHAR_LIMIT;
  const displayedText = isLongText && !isExpanded ? text.slice(0, CHAR_LIMIT) + "..." : text;

  const hasFiles = messageFiles && Array.isArray(messageFiles) && messageFiles.length > 0;

  return (
    <div className="flex flex-col gap-2 justify-end items-end group">
      {hasFiles && (
        <div className="mb-1 w-full max-w-xs sm:max-w-lg flex flex-wrap justify-end gap-2">
          {messageFiles.map((fileItem, index) => {
            const { fileUrl, fileName, fileType } = fileItem;
            const isImage = fileType?.startsWith("image/") || (fileUrl ? isImageUrl(fileUrl) : false);

            return (
              <div key={`${fileUrl}-${index}`}>
                {isImage ? (
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={fileUrl}
                      alt={fileName}
                      className="rounded-2xl max-h-38 w-auto object-cover border border-primary/20 hover:opacity-95 transition-opacity"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div
                    onClick={() => downloadPdf(fileUrl, fileName)}
                    className="flex items-center gap-2 bg-white border border-primary/20 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
                  >
                    <div className="bg-gray-100 p-1.5 rounded-md text-primary">
                      <FileText size={16} />
                    </div>
                    <span className="text-xs text-primary font-medium truncate max-w-37.5">{fileName || "Attached File"}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {text && (
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
      )}

      <UserMessageToolTip isCopied={isCopied} onCopy={onCopy} />
    </div>
  );
});
