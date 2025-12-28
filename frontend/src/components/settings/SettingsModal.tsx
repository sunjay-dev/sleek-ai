import { useState } from "react";
import PersonalizationModal from "./PersonalizationModal";
import DataPrivacy from "./DataPrivacy";
import SettingsSidebar from "./SettingsSidebar";
import type { Tab } from "@/types";

type Props = {
  onClose: () => void;
  requestDeleteAll: () => void;
};

export default function SettingsModal({ onClose, requestDeleteAll }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("personalization");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="absolute inset-0 bg-gray-200/50" onClick={onClose} />

        <div className="relative w-full max-w-3xl h-[85vh] md:h-150 max-h-[90dvh] rounded-t-2xl md:rounded-lg rounded-b-none border border-gray-500/20 flex flex-col overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />

            <main className="flex-1 overflow-y-auto bg-white relative">
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "personalization" && <PersonalizationModal />}

                {activeTab === "data" && <DataPrivacy requestDeleteAll={requestDeleteAll} />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
