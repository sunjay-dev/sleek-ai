import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, Repeat2, Check } from 'lucide-react' // ✅ import Check

type Message = {
  text: string
  isAi: boolean
}

const MessagesContainer: React.FC<{ messages: Message[]; onResend?: () => void }> = ({ messages, onResend }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  const handleCopy = async (text: string, idx: number) => {
    try {
      setTimeout(() => setCopiedIndex((s) => (s === idx ? null : s)), 1500)
      await navigator.clipboard.writeText(text)
      setCopiedIndex(idx)
    } catch (e) {
      console.error('copy failed', e)
    }
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-auto py-6 md:mb-36 mb-32 px-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-white/50 text-sm text-center">
            <p>No messages yet</p>
            <p className="mt-1">Type something below to get started ↓</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isAi ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-full text-sm ${message.isAi
                    ? 'p-4 rounded-xl selection:bg-gray-100 selection:text-neutral-800'
                    : 'bg-white text-neutral-800 px-3 rounded-2xl max-w-md selection:bg-gray-900/90 userMessage selection:text-white'
                  }`}
              >
                <div className="markdown">
                  {message.isAi ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>

                {message.isAi && (
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(message.text, index)}
                      className="flex items-center justify-center bg-white text-neutral-800 px-2 py-0.5 rounded-md text-xs transition-colors"
                      aria-label="Copy message"
                    >
                      {copiedIndex === index ? (
                        <Check size={14} className="transition-all duration-300" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>

                    {onResend && (
                      <button
                        type="button"
                        onClick={() => onResend()}
                        className="flex items-center justify-center bg-white text-neutral-800 px-2 py-0.5 rounded-md text-xs"
                        aria-label="Send again"
                      >
                        <Repeat2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessagesContainer
