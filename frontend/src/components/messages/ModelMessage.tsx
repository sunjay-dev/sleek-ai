import { useState, isValidElement, memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check, ExternalLink } from "lucide-react";
import styles from "@/styles/modelMessage.module.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ModelMessageToolTip from "../tooltips/ModelMessageToolTip";

type Props = {
  text: string;
  isCopied: boolean;
  onCopy: () => void;
  onResend?: () => void;
  hideToolTip?: boolean;
  isGenerating?: boolean;
};

export default memo(function ModelMessage({ text, isCopied, onCopy, onResend, hideToolTip, isGenerating }: Props) {
  function cleanAIMath(text: string) {
    return text
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$")
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      .replace(/\\n/g, "\n")
      .replace(/^\|.*$/gm, (line) => {
        return line.includes("```") ? line.replace(/```/g, "`") : line;
      })
      .trim();
  }

  return (
    <div className="max-w-full text-sm py-4 rounded-xl">
      {isGenerating && text.length === 0 ? (
        <span className="inline-block animate-pulse font-bold">▍</span>
      ) : (
        <div className={`${styles.markdown} ${isGenerating && styles.streamingCursor}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{
              pre: CodeBlock,

              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              a: ({ node, children, href, ...props }) => {
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link} {...props}>
                    {children}
                    <ExternalLink size={10} className="inline ml-0.5 mb-0.5 opacity-60" />
                  </a>
                );
              },
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              table: ({ node, ...props }) => (
                <div className={styles.tableWrapper}>
                  <table {...props} />
                </div>
              ),
            }}
          >
            {cleanAIMath(text)}
          </ReactMarkdown>
        </div>
      )}

      {!hideToolTip && <ModelMessageToolTip isCopied={isCopied} onCopy={onCopy} onResend={onResend} />}
    </div>
  );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractText = (node: any): string => {
  if (node.type === "text") {
    return node.value;
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }
  return "";
};

const CodeBlock: Components["pre"] = ({ node, children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeText = extractText(node);

  let language = "text";
  if (isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const className = (children.props as any).className || "";
    const match = /language-(\w+)/.exec(className);
    if (match) {
      language = match[1];
    }
  }

  const handleCopy = () => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlockContainer}>
      <div className={styles.codeBlockHeader}>
        <span className={styles.languageName}>{language}</span>
        <button onClick={handleCopy} className={styles.copyButton} aria-label="Copy code">
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className={styles.codeBlockContent} {...props}>
        {children}
      </pre>
    </div>
  );
};
