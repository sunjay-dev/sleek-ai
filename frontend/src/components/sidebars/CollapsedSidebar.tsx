import { PanelLeftOpen, BadgePlus } from "lucide-react";

type Props = {
  setCollapsed: (v: boolean) => void;
  createNewChat: () => void;
};

export default function CollapsedSidebar({ setCollapsed, createNewChat }: Props) {
  return (
    <div className="fixed top-3 left-3 flex items-center gap-2 z-50">
      <div onClick={() => setCollapsed(false)} className="flex items-center justify-center w-7 h-7 cursor-pointer">
        <img src="/logo.png" alt="Chatty-AI Logo" className="w-full h-full object-contain" />
      </div>

      <div className="bg-white rounded-full shadow-md border border-gray-500/20 flex items-center gap-1 px-1.5 py-0.5">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-[#e9e9e980] transition"
          title="Open sidebar"
        >
          <PanelLeftOpen strokeWidth={2} size={15} className="text-primary" />
        </button>

        <button
          onClick={createNewChat}
          className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-[#e9e9e980] transition"
          title="New chat"
        >
          <BadgePlus strokeWidth={2} size={15} className="text-primary" />
        </button>
      </div>
    </div>
  );
}
