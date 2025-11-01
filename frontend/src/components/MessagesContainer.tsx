import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

type Message = {
  text: string
  isAi: boolean
}

const MessagesContainer: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div ref={containerRef} className="flex-1 overflow-auto py-6 mb-36 px-4">
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
            <div
              key={index}
              className={`flex ${message.isAi ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[100%] text-sm break-words ${
                  message.isAi ? 'bg-neutral-800 text-white p-4 rounded-xl selection:bg-gray-100 selection:text-neutral-900' : 'bg-white text-neutral-900 px-2.5 py-1.5 rounded-lg'
                }`}
              >
                <div className="markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {message.text}
                </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessagesContainer