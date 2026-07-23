import { Check, Copy } from "lucide-react";

type Props = {
  isCopied: boolean;
  onCopy: () => void;
};

export default function UserMessageToolTip({ isCopied, onCopy }: Props) {
  return (
    <button
      title="copy"
      onClick={onCopy}
      className="mr-2 p-1 text-[#1c1c1c]/80 hover:bg-[#e9e9e980] active:bg-[#e9e9e980] rounded-full md:opacity-0 md:group-hover:opacity-100 md:group-active:opacity-100 opacity-100 transition-opacity"
      aria-label="Copy message"
    >
      {isCopied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
