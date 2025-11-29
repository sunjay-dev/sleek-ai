import { useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import styles from '@/styles/modelMessage.module.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import ModelMessageToolTip from '../tooltips/ModelMessageToolTip';

type Props = {
  text: string
  isCopied: boolean
  onCopy: () => void
  onResend?: () => void
}

export default function ModelMessage({ text, isCopied, onCopy, onResend }: Props) {
  function cleanAIMath(text: string) {
    return text
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n');
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-full text-sm py-4 rounded-xl">
        <div className={styles.markdown}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{
              pre: CodeBlock,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              table: ({ node, ...props }) => <div className={styles.tableWrapper}><table {...props} /></div>,
            }}
          >
            {cleanAIMath(text)}
          </ReactMarkdown>
        </div>

        <ModelMessageToolTip isCopied={isCopied} onCopy={onCopy} onResend={onResend} />
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractText = (node: any): string => {
  if (node.type === 'text') {
    return node.value
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join('')
  }
  return "";
}

const CodeBlock: Components['pre'] = ({ node, children }) => {
  const [isCopied, setIsCopied] = useState(false)
  const codeText = extractText(node)

  const handleCopy = () => {
    if (!codeText) return
    navigator.clipboard.writeText(codeText)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <pre className={styles.codeBlock}>
      <button onClick={handleCopy} className={styles.copyButton} aria-label="Copy code">
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      {children}
    </pre>
  )
}