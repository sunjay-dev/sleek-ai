import React from 'react'
import { Copy, Check } from 'lucide-react'

type Props = {
  text: string
  isCopied: boolean
  onCopy: () => void
}

const UserMessage: React.FC<Props> = ({ text, isCopied, onCopy }) => {
  return (
    <div className="flex flex-col gap-2 justify-end items-end">
      <div className="bg-white text-neutral-800 px-3 py-2 rounded-xl max-w-md selection:bg-gray-900/90 userMessage selection:text-white text-sm">
        <p className="leading-relaxed">{text}</p>
      </div>
      <button
        onClick={onCopy}
        className="mr-2 p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-neutral-400"
        aria-label="Copy message"
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  )
}

export default UserMessage