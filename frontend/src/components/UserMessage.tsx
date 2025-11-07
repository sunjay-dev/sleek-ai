import { Copy, Check } from 'lucide-react';

type Props = {
  text: string
  isCopied: boolean
  onCopy: () => void
}

export default function UserMessage ({ text, isCopied, onCopy }: Props){
  return (
    <div className="flex flex-col gap-2 justify-end items-end group">
      <div className="bg-white text-neutral-800 px-3 py-2 rounded-xl max-w-md selection:bg-gray-900/90 selection:text-white text-sm whitespace-pre-wrap wrap-break-words leading-[1.4]">
        <p className="leading-relaxed">{text}</p>
      </div>
      <button
        onClick={onCopy}
        className="mr-2 p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy message"
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}