import { useState, isValidElement, memo, useRef, useCallback, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Copy, Check } from "lucide-react";
import ModelMessageToolTip from "../tooltips/ModelMessageToolTip";
import OpenUIBlock from "../openui/OpenUIBlock";

const extractCodeText = (element: unknown): string => {
  if (typeof element === "string") return element;
  if (typeof element === "number") return String(element);
  if (Array.isArray(element)) return element.map(extractCodeText).join("");
  if (isValidElement(element)) {
    const p = element.props as { children?: unknown };
    return extractCodeText(p?.children);
  }
  return "";
};

const DefaultCodeBlock = memo(function DefaultCodeBlock({
  children,
  language,
  ...props
}: {
  children: React.ReactNode;
  language: string;
  [key: string]: unknown;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = useCallback(() => {
    const text = preRef.current?.textContent || "";
    if (!text) return;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, []);

  return (
    <div className="codeBlockContainer">
      <div className="codeBlockHeader">
        <span className="languageName">{language}</span>
        <button onClick={handleCopy} className="copyButton" aria-label="Copy code">
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="custom-scroll" ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
});

const REMARK_PLUGINS = [remarkGfm, [remarkMath, { singleDollarTextMath: false }]] as const;
const REHYPE_PLUGINS = [
  rehypeHighlight,
  [rehypeKatex, { strict: false }],
  [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
] as const;

type Props = {
  text: string;
  isCopied: boolean;
  onCopy: () => void;
  onResend?: () => void;
  hideToolTip?: boolean;
  isGenerating?: boolean;
  status?: string | null;
  onAction?: (action: unknown) => void;
};

function ModelMessage({ text, status, isCopied, onCopy, onResend, hideToolTip, isGenerating, onAction }: Props) {
  const isError = text && (text.includes("interrupted") || text.includes("went wrong") || text.includes("stopped"));
  const trimmed = text ? text.trim() : "";
  const isPureOpenUI = trimmed.startsWith("root =") || trimmed.startsWith("]]>openui:");

  const renderPre: Components["pre"] = useCallback(
    ({ children, ...props }) => {
      let language = "text";
      let childProps: { className?: string; children?: unknown } | undefined;

      if (isValidElement(children)) {
        childProps = children.props as { className?: string; children?: unknown };
        if (childProps?.className) {
          const match = /language-(\w+)/.exec(childProps.className);
          if (match) language = match[1].toLowerCase();
        }
      }

      if (language === "openui" || language === "openui-lang") {
        const code = extractCodeText(childProps?.children);
        return <OpenUIBlock code={code} isStreaming={isGenerating} onAction={onAction} />;
      }

      return (
        <DefaultCodeBlock language={language} {...props}>
          {children}
        </DefaultCodeBlock>
      );
    },
    [isGenerating, onAction],
  );

  const markdownComponents = useMemo<Components>(() => ({ pre: renderPre }), [renderPre]);

  return (
    <div className="max-w-full text-[15px] sm:text-sm py-3 rounded-xl">
      {isGenerating && text.length === 0 && !status ? (
        <span className="inline-block animate-pulse font-bold">▍</span>
      ) : (
        <div className={`markdown ${isGenerating && !status && "streamingCursor"}`}>
          {status && !isError && (
            <div className="analyzing-container">
              <span>{status}</span>
            </div>
          )}
          {text &&
            (isPureOpenUI ? (
              <OpenUIBlock code={trimmed} isStreaming={isGenerating} onAction={onAction} />
            ) : (
              <ReactMarkdown
                remarkPlugins={REMARK_PLUGINS as unknown as any[]}
                rehypePlugins={REHYPE_PLUGINS as unknown as any[]}
                components={markdownComponents}
              >
                {text}
              </ReactMarkdown>
            ))}
        </div>
      )}

      {!hideToolTip && <ModelMessageToolTip isCopied={isCopied} onCopy={onCopy} onResend={onResend} />}
    </div>
  );
}

function areModelMessagePropsEqual(prev: Props, next: Props): boolean {
  return (
    prev.text === next.text &&
    prev.status === next.status &&
    prev.isCopied === next.isCopied &&
    prev.hideToolTip === next.hideToolTip &&
    prev.isGenerating === next.isGenerating &&
    prev.onAction === next.onAction &&
    prev.onResend === next.onResend
  );
}

export default memo(ModelMessage, areModelMessagePropsEqual);
