import React, { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Upload, Loader2, Paperclip, X } from 'lucide-react'
import ModelSelector, { type Model } from './ModelSelector'

type Props = {
  onSend: (text: string, file?: File | null) => void
  isLoading: boolean
  models: Model[]
  selectedModel: string
  onModelChange: (modelId: string) => void
}

const InputContainer: React.FC<Props> = ({ onSend, isLoading, models, selectedModel, onModelChange }) => {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isLoading || (!message.trim() && !file)) return
    const text = message.trim()
    onSend(text, file)
    setMessage('')
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${scrollHeight}px`
    }
  }, [message])

  return (
    <div className="fixed inset-x-0 bottom-2">
      <div className="mx-auto max-w-2xl px-4 pb-2 ">
        <form onSubmit={handleSubmit}>
          <div className="bg-neutral-800 rounded-lg border border-white/20 p-2">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              rows={2}
              className="w-full bg-neutral-800 py-1 px-1.5 text-white text-sm focus:outline-none resize-none placeholder:text-white/50 mb-1 overflow-y-auto max-h-30 no-scrollbar"
            />

            {file && (
              <div className="flex items-center gap-2 bg-neutral-700/50 px-2 py-1 rounded-md text-xs text-white/80 mt-2">
                <Paperclip size={14} />
                <span className="truncate flex-1">{file.name}</span>
                <button type="button" onClick={handleRemoveFile} className="p-1 hover:bg-neutral-700 rounded-full">
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-white/10 pt-2">
              <div className="flex items-center gap-2">
                <ModelSelector
                  models={models}
                  selectedModel={selectedModel}
                  onModelChange={onModelChange}
                  isLoading={isLoading}
                />
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-1 bg-white text-neutral-800 px-2 py-1 rounded-md hover:bg-neutral-100 cursor-pointer text-xs"
                  >
                    <Upload size={14} />
                    Upload
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-1 bg-white text-neutral-800 px-3 py-1 rounded-md hover:bg-neutral-100 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    Send <SendHorizontal size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InputContainer