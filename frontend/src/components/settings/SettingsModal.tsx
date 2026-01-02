import { useState } from "react";
import PersonalizationModal from "./PersonalizationModal";
import DataPrivacy from "./DataPrivacy";
import SettingsSidebar from "./SettingsSidebar";
import type { Tab } from "@/types";
import MemoryModal from "./MemoryModal";

type Props = {
  onClose: () => void;
  requestDeleteAll: () => void;
};

export default function SettingsModal({ onClose, requestDeleteAll }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("personalization");

  const inputBase = "w-full px-3 py-2 text-xs bg-white border border-gray-500/20 rounded-lg outline-none focus:border-primary/50 transition";
  const labelBase = "text-xs font-medium mb-1.5 block text-gray-700";
  const sectionHeader = "text-sm font-semibold text-primary pb-2 border-b border-gray-100 mb-3 mt-1";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 backdrop-blur-[1px] bg-gray-200/80" onClick={onClose} />

      <div className="relative w-full max-w-3xl h-[85vh] md:h-150 max-h-[90dvh] rounded-t-2xl md:rounded-lg rounded-b-none border border-gray-500/20 flex flex-col overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />

          <main className="flex-1 overflow-y-auto bg-white relative">
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === "personalization" && <PersonalizationModal inputBase={inputBase} labelBase={labelBase} sectionHeader={sectionHeader} />}

              {activeTab === "memory" && <MemoryModal inputBase={inputBase} />}

              {activeTab === "data" && <DataPrivacy requestDeleteAll={requestDeleteAll} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
