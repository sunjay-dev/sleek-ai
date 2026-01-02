import { Trash2, Search, Brain } from "lucide-react";
import { useState } from "react";

type Props = {
  inputBase: string;
};

export default function MemorySettings({ inputBase }: Props) {
  const MOCK_MEMORIES = [
    "User is a full-stack developer using React and Hono.",
    "cake prefers minimalist UI designs with Tailwind CSS.",
    "User is building an AI chat app with memory features.",
  ];

  const [memories, setMemories] = useState(MOCK_MEMORIES);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all learned memories?")) {
      setMemories([]);
    }
  };

  const handleDeleteOne = (index: number) => {
    setMemories(memories.filter((_, i) => i !== index));
  };

  const filteredMemories = memories.filter((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="py-4 px-6 space-y-6 h-full flex flex-col">
      <div>
        <h3 className="text-lg font-normal pb-2 border-b border-gray-500/20 mb-4 flex items-center gap-2">Memory</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          These are specific facts the AI has learned about you over time. You can review or delete them here.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            placeholder="Search your memories..."
            className={`${inputBase} pl-9`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{memories.length} facts stored</span>
          {memories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1.5"
            >
              <Trash2 size={12} />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2">
        {filteredMemories.length > 0 ? (
          filteredMemories.map((memory, index) => (
            <div
              key={index}
              className="group flex items-center justify-between px-3 py-2 bg-white border border-gray-500/20 rounded-lg hover:border-gray-300"
            >
              <p className="text-[13px] text-gray-700 leading-relaxed mr-3">{memory}</p>
              <button
                onClick={() => handleDeleteOne(index)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                title="Delete this fact"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 border border-dashed border-gray-200 rounded-lg">
            <Brain size={24} className="mb-2 opacity-50" />
            <p className="text-xs">No memories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
