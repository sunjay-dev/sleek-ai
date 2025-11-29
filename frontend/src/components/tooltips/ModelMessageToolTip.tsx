import { Check, Copy, Repeat2 } from 'lucide-react';

type Props = {
  isCopied: boolean
  onCopy: () => void
  onResend?: () => void
}

export default function ModelMessageToolTip({ isCopied, onCopy, onResend }: Props) {
  return (
    <div className="mt-2 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onCopy}
        className="mr-1 p-1 text-[#1c1c1c]/80 hover:bg-[#e9e9e980] active:bg-[#e9e9e980] rounded-full"
        aria-label="Copy message"
      >
        {isCopied ? <Check size={14} className="transition-all duration-300" /> : <Copy size={14} />}
      </button>

      {onResend && (
        <button type="button" onClick={onResend} className="mr-1 p-1 text-[#1c1c1c]/80 hover:bg-[#e9e9e980] active:bg-[#e9e9e980] rounded-full" aria-label="Send again">
          <Repeat2 size={14} />
        </button>
      )}
    </div>
  );
}
