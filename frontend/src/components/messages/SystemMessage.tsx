import type { Message } from "@/types";
import { AlertCircle } from "lucide-react";

type Props = {
  message: Message;
};

export default function SystemMessage({ message }: Props) {
  return (
    <div className="w-full my-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 w-fit max-w-[85%]">
        <div className="mt-0.5 shrink-0">
          <AlertCircle size={16} className="text-red-500" />
        </div>

        <span className="text-sm text-primary font-medium">{message.text}</span>
      </div>
    </div>
  );
}
