import {UserMessageToolTip} from '@/components';

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
      <UserMessageToolTip isCopied={isCopied} onCopy={onCopy} />
    </div>
  );
}