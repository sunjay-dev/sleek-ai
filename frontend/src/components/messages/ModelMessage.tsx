import { useState, isValidElement, memo, useRef, useCallback } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Copy, Check } from "lucide-react";
import ModelMessageToolTip from "../tooltips/ModelMessageToolTip";

const CodeBlock: Components["pre"] = ({ children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  let language = "text";

  if (isValidElement(children)) {
    const childProps = children.props as { className?: string };
    if (childProps.className) {
      const match = /language-(\w+)/.exec(childProps.className);
      if (match) language = match[1];
    }
  }

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
};

type Props = {
  text: string;
  isCopied: boolean;
  onCopy: () => void;
  onResend?: () => void;
  hideToolTip?: boolean;
  isGenerating?: boolean;
  status?: string | null;
};

export default memo(function ModelMessage({ text, status, isCopied, onCopy, onResend, hideToolTip, isGenerating }: Props) {
  return (
    <div className="max-w-full text-[15px] sm:text-sm py-3 rounded-xl">
      {isGenerating && text.length === 0 && !status ? (
        <span className="inline-block animate-pulse font-bold">▍</span>
      ) : (
        <div className={`markdown ${isGenerating && !status && "streamingCursor"}`}>
          {status && (
            <div className="analyzing-container">
              <span>{status}</span>
            </div>
          )}
          {text && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
              rehypePlugins={[
                rehypeHighlight,
                [rehypeKatex, { strict: false }],
                [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
              ]}
              components={{ pre: CodeBlock }}
            >
              {text}
            </ReactMarkdown>
          )}
        </div>
      )}

      {!hideToolTip && <ModelMessageToolTip isCopied={isCopied} onCopy={onCopy} onResend={onResend} />}
    </div>
  );
});
