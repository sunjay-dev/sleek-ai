import { UserButton } from "@clerk/clerk-react";
import { BadgePlus, AlignLeft } from "lucide-react";
import { RoundedPanelLeft } from "../icons/RoundedPanelLeft";

type Props = {
  setCollapsed: (v: boolean) => void;
  createNewChat: () => void;
  onWelcomeScreen: boolean;
};

export default function CollapsedSidebar({ setCollapsed, createNewChat, onWelcomeScreen }: Props) {
  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 md:hidden ${onWelcomeScreen ? "bg-light" : "bg-white"}`}>
        <div className="flex items-center justify-between h-15 pt-3 pl-2.5 pr-4.5 pb-1">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center text-primary justify-center h-10 w-10 rounded-full hover:bg-gray-100 active:bg-gray-200"
            title="Open sidebar"
          >
            <AlignLeft strokeWidth={2} size={20} />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={createNewChat}
              className="flex items-center text-primary justify-center h-10 w-10 rounded-full hover:bg-gray-100 active:bg-gray-200"
              title="New chat"
            >
              <BadgePlus strokeWidth={1.8} size={20} />
            </button>

            <UserButton />
          </div>
        </div>
      </div>

      <div className="hidden fixed top-3 left-3 md:flex items-center gap-2 z-50">
        <div onClick={() => setCollapsed(false)} className="flex items-center justify-center w-9 h-7.5 cursor-pointer">
          <img src="/logo.webp" alt="Sleek AI Logo" className="w-full h-full object-fill" />
        </div>

        <div className="bg-white rounded-full shadow-xs border border-gray-500/20 flex items-center gap-1 px-1.5 py-0.5">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-[#e9e9e980] active:bg-[#e9e9e980] transition"
            title="Open sidebar"
          >
            <RoundedPanelLeft size="16" />
          </button>

          <button
            onClick={createNewChat}
            className="flex items-center justify-center h-7 w-7 rounded-full hover:bg-[#e9e9e980] active:bg-[#e9e9e980] transition"
            title="New chat"
          >
            <BadgePlus strokeWidth={2.2} size={16} className="text-primary" />
          </button>
        </div>
      </div>
    </>
  );
}
