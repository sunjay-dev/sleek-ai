import { useState } from 'react'

export type Message = {
  text: string
  isAi: boolean
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { text, isAi: false }
    setMessages((s) => [...s, userMsg])

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

  return {
    messages,
    sendMessage,
    resendLastUser,
  }
}