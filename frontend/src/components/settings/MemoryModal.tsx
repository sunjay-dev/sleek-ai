import { useAuth } from "@clerk/clerk-react";
import { Trash2, Search, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import Loader from "../loaders/Loader";

type Memory = {
  id: string;
  content: string;
};

type Props = {
  inputBase: string;
};

export default function MemorySettings({ inputBase }: Props) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    async function handleGetUserMemories() {
      const token = await getToken();
      if (!token) return;

      setIsLoading(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/memories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => setMemories(data))
        .catch((error) => console.error("Error loading memories:", error))
        .finally(() => setIsLoading(false));
    }
    handleGetUserMemories();
  }, [getToken]);

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all learned memories? This cannot be undone.")) {
      return;
    }

    const token = await getToken();
    if (!token) return;

    setIsDeleting(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/memories`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to clear");
        setMemories([]);
      })
      .catch((error) => {
        console.error("Failed to clear memories:", error);
        alert("Failed to clear memories. Please try again.");
      })
      .finally(() => setIsDeleting(false));
  };

  const handleDeleteOne = async (id: string) => {
    const previousMemories = [...memories];
    setMemories((prev) => prev.filter((m) => m.id !== id));

    const token = await getToken();
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/memories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete");
      })
      .catch((error) => {
        console.error("Failed to delete memory:", error);
        setMemories(previousMemories);
        alert("Failed to delete memory.");
      });
  };

  const filteredMemories = memories.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
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
              disabled={isDeleting}
              className="text-[11px] text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isDeleting ? "Clearing..." : "Clear All"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-1 justify-center h-40 text-gray-400">
            <Loader size="24" />
            <p className="text-xs">Loading memories...</p>
          </div>
        ) : filteredMemories.length > 0 ? (
          filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="group flex items-center justify-between px-3 py-2 bg-white border border-gray-500/20 rounded-lg hover:border-gray-300 transition-colors"
            >
              <p className="text-[13px] text-gray-700 leading-relaxed mr-3">{memory.content}</p>
              <button
                onClick={() => handleDeleteOne(memory.id)}
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
