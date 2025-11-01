import React, { useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, Repeat2, Check } from 'lucide-react'
import styles from './AiMessage.module.css'

type Props = {
  text: string
  isCopied: boolean
  onCopy: () => void
  onResend?: () => void
}

const AiMessage: React.FC<Props> = ({ text, isCopied, onCopy, onResend }) => {
  if (text === 'Thinking...') {
    return (
      <div className="flex justify-start">
        <div className="max-w-full text-sm md:p-4 rounded-xl w-full">
          <div className="space-y-2">
            <div className="h-4 bg-neutral-700 rounded w-3/4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-600 to-transparent animate-shimmer -translate-x-full" />
            </div>
            <div className="h-4 bg-neutral-700 rounded w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-600 to-transparent animate-shimmer -translate-x-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-full text-sm py-4 rounded-xl selection:bg-gray-100 selection:text-neutral-800">
        <div className={styles.markdown}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: CodeBlock,
              table: ({ node, ...props }) => <div className={styles.tableWrapper}><table {...props} /></div>,
            }}
          >
            {text}
          </ReactMarkdown>
        </div>

        {text !== 'Thinking...' && (
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center justify-center bg-white text-neutral-800 px-2 py-0.5 rounded-md text-xs transition-colors"
              aria-label="Copy message"
            >
              {isCopied ? <Check size={14} className="transition-all duration-300" /> : <Copy size={14} />}
            </button>

            {onResend && (
              <button type="button" onClick={onResend} className="flex items-center justify-center bg-white text-neutral-800 px-2 py-0.5 rounded-md text-xs" aria-label="Send again">
                <Repeat2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const extractText = (node: any): string => {
  if (node.type === 'text') {
    return node.value
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join('')
  }
  return ''
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

export default AiMessage