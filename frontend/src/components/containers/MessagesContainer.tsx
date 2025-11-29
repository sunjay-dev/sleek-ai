import { useEffect, useRef, useState } from 'react';
import {UserMessage, ModelMessage} from '@/components';
import type { Message } from '@/types';

type Props = {
  messages: Message[]
  onResend?: () => void
  isLoading: boolean
}

export default function MessagesContainer ({ messages, onResend, isLoading }: Props) {
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
    <div ref={containerRef} className={`flex-1 overflow-auto py-6 px-5 mx-auto w-full max-w-180 ${messages.length === 0 ? 'h-[-webkit-fill-available]' : ''}`}>
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-primary text-sm text-center">
            <p>No messages yet</p>
            <p className="mt-1">Type something below to get started ↓</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {message.isAi ? (
                <ModelMessage
                  text={message.text}
                  isCopied={copiedIndex === index}
                  onCopy={() => handleCopy(message.text, index)}
                  onResend={onResend}
                />
              ) : (
                <UserMessage
                  text={message.text}
                  isCopied={copiedIndex === index}
                  onCopy={() => handleCopy(message.text, index)}
                />
              )}
            </div>
          ))}
          {isLoading && (
            <div>
              <ModelMessage text="Thinking..." isCopied={false} onCopy={() => {}} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}