import React, { useEffect } from 'react'
import MessagesContainer from '../components/MessagesContainer'
import InputContainer from '../components/InputContainer'
import { type Model } from '../components/ModelSelector'
import { useChat } from '../page/useChat'

const models: Model[] = [
  { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
  { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B' },
  { id: 'qwen/qwen3-32b', name: 'Qwen 3 32B' },
  { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout' },
  { id: 'moonshotai/kimi-k2-instruct-0905', name: 'Kimi K2' },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
  { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', name: 'Llama 4 Maverick' },
  { id: 'openai/gpt-oss-safeguard-20b', name: 'Safety GPT OSS 20B' },
  { id: 'meta-llama/llama-guard-4-12b', name: 'Llama Guard' },
];

const ChatPage: React.FC = () => {
  const { messages, sendMessage, resendLastUser, isLoading, selectedModel, setSelectedModel } = useChat()

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }
  
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  return (
    <div className={`${messages.length === 0 ? 'h-screen' : 'min-h-screen'} bg-neutral-900 flex flex-col`}>
      <div className="md:max-w-3xl max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <MessagesContainer messages={messages} onResend={resendLastUser} isLoading={isLoading} />
        <InputContainer
          onSend={sendMessage}
          isLoading={isLoading}
          models={models}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      </div>
    </div>
  )
}

export default ChatPage