import React, { useState } from 'react'
import MessagesContainer from '../components/MessagesContainer'
import InputContainer from '../components/InputContainer'

type Message = {
  text: string
  isAi: boolean
}

const ChatPage: React.FC = () => {

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { text, isAi: false }
    setMessages((s) => [...s, userMsg]);

    scrollToBottom();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      })
      const data = await res.json()
      const aiText = data?.response ?? 'Sorry, no response.'
      const aiMsg: Message = { text: aiText, isAi: true }
      setMessages((s) => [...s, aiMsg])
    } catch (err) {
      console.error(err)
      const errMsg: Message = { text: 'Error: failed to contact server.', isAi: true }
      setMessages((s) => [...s, errMsg])
    }
  }

  const resendLastUser = async () => {
    const lastUser = [...messages].reverse().find((m) => !m.isAi)
    if (!lastUser) return
    await sendMessage(lastUser.text)
  }

  return (
    <div className={`${messages.length === 0 ? 'h-screen' : 'min-h-screen'} bg-neutral-900 flex flex-col`}>
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        <MessagesContainer messages={messages} onResend={resendLastUser} />
        <InputContainer onSend={sendMessage} />
      </div>
    </div>
  )
}

export default ChatPage