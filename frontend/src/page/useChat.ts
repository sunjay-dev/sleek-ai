import { useState } from 'react'
import type { Message } from '../components/MessagesContainer'

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    
    const sendMessage = async (text: string) => {
        if (!text.trim()) return

        const userMsg: Message = { text, isAi: false }
        setMessages((s) => [...s, userMsg])

        try {
            setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    }

    const resendLastUser = async () => {
        const lastUser = [...messages].reverse().find((m) => !m.isAi)
        if (!lastUser) return
        await sendMessage(lastUser.text)
    }

    return {
        messages,
        isLoading,
        sendMessage,
        resendLastUser,
    }
}