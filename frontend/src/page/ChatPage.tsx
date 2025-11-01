import React, { useEffect } from 'react'
import MessagesContainer from '../components/MessagesContainer'
import InputContainer from '../components/InputContainer'
import { useChat } from '../page/useChat'

const ChatPage: React.FC = () => {
  const { messages, sendMessage, resendLastUser, isLoading } = useChat()

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
        <InputContainer onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default ChatPage