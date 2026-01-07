import type { Tab } from "@/types";
import { Brain, Shield, Sparkles, X } from "lucide-react";

type Props = {
  onClose: () => void;
  setActiveTab: (tab: Tab) => void;
  activeTab: Tab;
};

export default function SettingsSidebar({ activeTab, setActiveTab, onClose }: Props) {
  const navItemBase = "text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2.5";
  const activeNav = "bg-white border border-gray-500/20 text-primary";
  const inactiveNav = "text-gray-lab hover:bg-gray-200/50 active:bg-gray-200/50";

  return (
    <aside className="w-full md:w-43 border-b-[1.3px] md:border-b-0 md:border-r border-gray-500/20 bg-darker p-3 flex flex-col gap-1 shrink-0 h-auto md:overflow-y-auto">
      <div className="px-1 pb-2 mb-2 flex justify-end md:justify-start">
        <button
          onClick={onClose}
          className="p-1 text-gray-lab hover:text-primary hover:bg-gray-200/50  active:bg-gray-200/50 rounded-md transition-colors"
          aria-label="Close Settings"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-wrap md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        <button
          onClick={() => setActiveTab("personalization")}
          className={`${navItemBase} ${activeTab === "personalization" ? activeNav : inactiveNav}`}
        >
          <Sparkles size={14} className="shrink-0" /> <span className="whitespace-nowrap">Personalization</span>
        </button>

        <button onClick={() => setActiveTab("memory")} className={`${navItemBase} ${activeTab === "memory" ? activeNav : inactiveNav}`}>
          <Brain size={14} className="shrink-0" /> <span className="whitespace-nowrap">Memory</span>
        </button>

        <button onClick={() => setActiveTab("data")} className={`${navItemBase} ${activeTab === "data" ? activeNav : inactiveNav}`}>
          <Shield size={14} className="shrink-0" /> <span className="whitespace-nowrap">Data Privacy</span>
        </button>
      </div>
    </aside>
  );
}
