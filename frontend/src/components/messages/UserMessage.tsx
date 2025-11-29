import { Copy, Check } from 'lucide-react';

type Props = {
  text: string
  isCopied: boolean
  onCopy: () => void
}

export default function UserMessage ({ text, isCopied, onCopy }: Props){
  return (
    <div className="flex flex-col gap-2 justify-end items-end group">
      <div className="user-message-color text-primary boder px-3 py-2 rounded-2xl max-w-md selection:bg-gray-900/90 selection:text-white text-sm whitespace-pre-wrap wrap-break-words word-break leading-[1.4]">
        <p className="leading-relaxed">{text}</p>
      </div>
      <button
        onClick={onCopy}
        className="mr-2 p-1 text-[#1c1c1c]/80 hover:bg-[#e9e9e980] active:bg-[#e9e9e980] rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
        aria-label="Copy message"
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}