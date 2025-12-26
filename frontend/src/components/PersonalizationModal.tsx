import { X, Sparkles, User } from "lucide-react";
import { useState } from "react";
import MemoryModal from "./MemoryModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PersonalizationModal({ isOpen, onClose }: Props) {
  const [nickname, setNickname] = useState("");
  const [occupation, setOccupation] = useState("");
  const [moreAbout, setMoreAbout] = useState("");

  const [customInstructions, setCustomInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  const [memories, setMemories] = useState<string[]>([]);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Saving settings...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const clearMemory = async () => {
    if (!confirm("Clear all AI memory?")) return;
    setMemories([]);
  };

  if (!isOpen) return null;

  const inputBase = "w-full px-3 py-2 text-xs bg-white border border-gray-500/20 rounded-lg";
  const labelBase = "text-xs font-medium mb-1.5";
  const sectionHeader = "text-[14px] font-semibold text-primary flex items-center gap-2 pb-2 border-b border-secondary mb-3";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="relative bg-white w-full max-w-xl rounded-xl border border-secondary flex flex-col max-h-[90dvh]">
          <div className="px-5 py-3 border-b border-secondary flex items-center justify-between">
            <h2 className="font-semibold text-sm">Personalization</h2>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-300/20">
              <X size={16} />
            </button>
          </div>

          <div id="personalizationModel" className="p-5 overflow-y-auto space-y-5">
            <section>
              <h3 className={sectionHeader}>
                <User size={14} /> About You
              </h3>

              <div className="space-y-3">
                <div>
                  <label className={labelBase}>Nickname</label>
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="What should I call you?"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelBase}>Occupation</label>
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="e.g. Student, Designer"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelBase}>More about you</label>
                  <textarea
                    className={`${inputBase} h-16 resize-none`}
                    placeholder="Hobbies, interests, goals..."
                    value={moreAbout}
                    onChange={(e) => setMoreAbout(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className={sectionHeader}>
                <Sparkles size={14} /> AI Behavior
              </h3>

              <div className="space-y-3">
                <div>
                  <label className={labelBase}>Custom Instructions</label>
                  <textarea
                    className={`${inputBase} h-20 resize-none`}
                    placeholder="e.g. 'Explain things simply' or 'Reply in JSON'"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 border border-secondary rounded-lg bg-gray-50/50">
                  <div>
                    <span className="block text-[13px] font-medium text-primary">Memory</span>
                    <span className="text-[11px] text-gray-lab">{memories.length} facts learned</span>
                  </div>
                  <button
                    onClick={() => setIsMemoryModalOpen(true)}
                    className="px-2.5 py-1.5 text-xs font-medium bg-white border border-secondary rounded-md hover:opacity-90 flex items-center gap-1"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="px-5 py-3 border-t border-secondary rounded-t-none rounded-2xl flex justify-end gap-2 bg-gray-50/30">
            <button onClick={onClose} className="px-3 py-1.5 text-xs hover:bg-gray-300/20 rounded-lg">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-secondary hover:opacity-90 rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <MemoryModal isOpen={isMemoryModalOpen} onClose={() => setIsMemoryModalOpen(false)} memories={memories} onClear={clearMemory} />
    </>
  );
}
