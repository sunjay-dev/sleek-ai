import { useAuth } from "@clerk/clerk-react";
import { Trash2, Search, Brain } from "lucide-react";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import Loader from "../loaders/Loader";
import type { UserMemory } from "@/types";
import { apiRequest } from "@/utils/api";

type Props = {
  memories: UserMemory[] | null;
  setMemories: Dispatch<SetStateAction<UserMemory[] | null>>;
  requestDeleteMemory: (id: string) => void;
  requestDeleteAllMemories: () => void;
};

export default function MemorySettings({ memories, setMemories, requestDeleteMemory, requestDeleteAllMemories }: Props) {
  const { getToken } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(!memories);

  const data = memories || [];

  useEffect(() => {
    if (memories) {
      setIsLoading(false);
      return;
    }

    async function handleGetUserMemories() {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("You must be logged in to search memories.");
        const data = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/user/memories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMemories(data);
      } finally {
        setIsLoading(false);
      }
    }
    handleGetUserMemories();
  }, [getToken, memories, setMemories]);

  const filteredMemories = data.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
        <Loader size="24" />
        <p className="text-xs">Loading memories...</p>
      </div>
    );
  }

  return (
    <div className="sm:py-4 py-6 px-6 space-y-6 h-full flex flex-col">
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
            className="w-full px-3 py-2 text-sm sm:text-xs border border-gray-500/20 rounded-lg outline-none transition pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{data.length} facts stored</span>
          {data?.length > 0 && (
            <button
              onClick={requestDeleteAllMemories}
              className="text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1.5 disabled:opacity-50"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2 custom-scroll">
        {Array.isArray(filteredMemories) && filteredMemories.length > 0 ? (
          filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="group flex items-center justify-between px-3 py-2 bg-white border border-gray-500/20 rounded-lg hover:border-gray-300 transition-colors"
            >
              <p className="text-[13px] text-gray-700 leading-relaxed mr-3">{memory.content}</p>
              <button
                onClick={() => requestDeleteMemory(memory.id)}
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
            <p className="text-xs">{searchQuery ? "No matching memories" : "No memories found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
