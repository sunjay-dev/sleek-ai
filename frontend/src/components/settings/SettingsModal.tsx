import { useState } from "react";
import PersonalizationModal from "./PersonalizationModal";
import DataPrivacy from "./DataPrivacy";
import SettingsSidebar from "./SettingsSidebar";
import type { Tab, UserMemory, UserPreferences } from "@/types";
import MemoryModal from "./MemoryModal";
import useMemoryDeletion from "@/hooks/useMemoryDeletion";
import DeleteModal from "../common/DeleteModal";

type Props = {
  onClose: () => void;
  DeleteChatIntent: () => void;
};

export default function SettingsModal({ onClose, DeleteChatIntent }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("personalization");

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [initialPreferences, setInitialPreferences] = useState<UserPreferences | null>(null);

  const [memories, setMemories] = useState<UserMemory[] | null>(null);

  const { intent, isDeleting, requestDeleteMemory, requestDeleteAllMemories, confirm, cancel } = useMemoryDeletion(setMemories);

  const inputBase = "w-full px-3 py-2 text-sm sm:text-xs border border-gray-500/20 rounded-lg outline-none transition";
  const labelBase = "sm:text-xs text-sm font-medium mb-1.5 block text-gray-700";
  const sectionHeader = "text-sm font-semibold text-primary pb-2 border-b border-gray-100 mb-3 mt-1";
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div className="absolute inset-0 backdrop-blur-[1px] bg-gray-200/80" onClick={onClose} />

        <div className="relative w-full max-w-3xl h-[85vh] md:h-150 max-h-[90dvh] rounded-t-2xl md:rounded-lg rounded-b-none border border-gray-500/20 flex flex-col overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />

            <main className="flex-1 overflow-y-auto bg-white relative custom-scroll">
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "personalization" && (
                  <PersonalizationModal
                    inputBase={inputBase}
                    labelBase={labelBase}
                    sectionHeader={sectionHeader}
                    preferences={preferences}
                    setPreferences={setPreferences}
                    initialPreferences={initialPreferences}
                    setInitialPreferences={setInitialPreferences}
                  />
                )}

                {activeTab === "memory" && (
                  <MemoryModal
                    inputBase={inputBase}
                    memories={memories}
                    setMemories={setMemories}
                    requestDeleteMemory={requestDeleteMemory}
                    requestDeleteAllMemories={requestDeleteAllMemories}
                  />
                )}

                {activeTab === "data" && <DataPrivacy DeleteChatIntent={DeleteChatIntent} />}
              </div>
            </main>
          </div>
        </div>
      </div>

      {intent && (
        <DeleteModal
          variant={intent.type === "single" ? "delete-memory" : "delete-all-memories"}
          loading={isDeleting}
          onCancel={cancel}
          onConfirm={confirm}
        />
      )}
    </>
  );
}
