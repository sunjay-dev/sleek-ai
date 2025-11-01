import React, { useEffect, useRef, useState } from 'react'
import UserMessage from './UserMessage'
import AiMessage from './AiMessage'

export type Message = {
  text: string
  isAi: boolean
}

const MessagesContainer: React.FC<{ messages: Message[]; onResend?: () => void; isLoading: boolean }> = ({ messages, onResend, isLoading }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const copyTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(idx)

      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => setCopiedIndex(null), 1500)
    } catch (e) { console.error('copy failed', e) }
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-auto py-6 pb-36 px-5">
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
            <div key={index}>
              {message.isAi ? (
                <AiMessage
                  text={message.text}
                  isCopied={copiedIndex === index}
                  onCopy={() => handleCopy(message.text, index)}
                  onResend={onResend}
                />
              ) : (
                <UserMessage text={message.text} />
              )}
            </div>
          ))}
          {isLoading && (
            <div>
              <AiMessage text="Thinking..." isCopied={false} onCopy={() => {}} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MessagesContainer
