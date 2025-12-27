import { useState } from "react";
import PersonalizationModal from "./PersonalizationModal";
import DataPrivacy from "./DataPrivacy";
import SettingsSidebar from "./SettingsSidebar";
import type { Tab } from "@/types";

type Props = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("personalization");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="absolute inset-0 bg-gray-200/50 backdrop-blur-[1px] transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-3xl h-[85vh] md:h-150 max-h-[90dvh] rounded-t-2xl md:rounded-lg rounded-b-none border border-gray-500/20 flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 bg-white">
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />

            <main className="flex-1 overflow-y-auto px-6 py-4 bg-white relative">
              {activeTab === "personalization" && <PersonalizationModal />}

              {activeTab === "data" && <DataPrivacy />}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
