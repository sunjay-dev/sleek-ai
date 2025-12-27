import { useState } from "react";
import MemoryModal from "./MemoryModal";

export default function PersonalizationSettings() {
  const [nickname, setNickname] = useState("");
  const [occupation, setOccupation] = useState("");
  const [moreAbout, setMoreAbout] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  const [memories, setMemories] = useState<string[]>([]);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  const clearMemory = async () => {
    if (!confirm("Clear all AI memory?")) return;
    setMemories([]);
  };

  const inputBase = "w-full px-3 py-2 text-xs bg-white border border-gray-500/20 rounded-lg outline-none";
  const labelBase = "text-xs font-medium mb-1.5";
  const sectionHeader = "text-sm font-semibold text-primary pb-2 border-b border-secondary mb-3";

  return (
    <>
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="overflow-y-auto space-y-5 px-1 no-scrollbar">
          <div className="mb-6">
            <h3 className="text-lg font-normal pb-2 border-b border-gray-500/20 mb-4">Personalization</h3>
            <p className="text-xs text-gray-lab leading-relaxed">Customize your profile details and how the AI behaves during conversations.</p>
          </div>

          <section>
            <h3 className={sectionHeader}>About You</h3>

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
            <h3 className={sectionHeader}>AI Behavior</h3>

            <div className="space-y-3">
              <div>
                <label className={labelBase}>Custom Instructions</label>
                <textarea
                  name="customInstructionTextArea"
                  id="customInstructionTextArea"
                  className={`${inputBase} h-24 resize-none`}
                  placeholder="e.g. 'Explain things simply' or 'Reply in JSON'"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-2.5 border border-secondary rounded-lg bg-primary">
                <div>
                  <span className="block text-[13px] font-medium text-primary">Memory</span>
                  <span className="text-[11px] text-gray-lab">{memories.length} facts learned</span>
                </div>
                <button
                  onClick={() => setIsMemoryModalOpen(true)}
                  className="px-2.5 py-1.5 text-xs font-medium bg-white border border-gray-500/20 rounded-md hover:opacity-90 flex items-center gap-1"
                >
                  Manage
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MemoryModal isOpen={isMemoryModalOpen} onClose={() => setIsMemoryModalOpen(false)} memories={memories} onClear={clearMemory} />
    </>
  );
}
