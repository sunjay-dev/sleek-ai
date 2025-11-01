import React, { useState } from 'react'
import { SendHorizontal, Upload, Smile } from 'lucide-react'

type Props = {
  onSend: (text: string) => void
}

const InputContainer: React.FC<Props> = ({ onSend }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = message.trim()
    if (!text) return
    onSend(text)
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-neutral-900">
      <div className="mx-auto max-w-2xl px-4 pb-2">
        <form onSubmit={handleSubmit}>
          <div className="bg-neutral-800 rounded-lg border border-white/20 p-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={2}
              className="w-full bg-transparent p-1.5 text-white text-sm focus:outline-none resize-none placeholder:text-white/50 mb-1 overflow-y-hidden"
              style={{ minHeight: '3rem', height: 'auto' }}
            />

            <div className="flex justify-between items-center border-t border-white/10 pt-2">
              <input type="file" className="hidden" id="file-upload" />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-1 bg-white text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-100 cursor-pointer text-xs"
              >
                <Upload size={14} />
                Upload
              </label>

              <div className="flex items-center gap-2">
                <button type="button" className="text-white/50 hover:text-white/80 p-1">
                  <Smile size={14} />
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1 bg-white text-neutral-900 px-3 py-1 rounded-md hover:bg-neutral-100 text-xs"
                >
                  Send
                  <SendHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InputContainer