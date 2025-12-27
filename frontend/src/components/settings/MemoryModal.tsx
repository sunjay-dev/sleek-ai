import { Trash2, X } from "lucide-react";

type MemoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  memories: string[];
  onClear: () => void;
};

export default function MemoryModal({ isOpen, onClose, memories, onClear }: MemoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-gray-200/50 backdrop-blur-[1px] transition-opacity" onClick={onClose} />

      <div className="relative bg-white w-full max-w-xl rounded-xl border border-secondary flex flex-col max-h-[90dvh] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-4 py-3 border-b border-secondary flex items-center justify-between">
          <h2 className="font-semibold text-sm">Manage Memory</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-300/20">
            <X size={16} />
          </button>
        </div>

        <div id="memoryModel" className="p-4 overflow-y-auto">
          {memories.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-lab uppercase tracking-wide">{memories.length} items learned</span>
                <button onClick={onClear} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 hover:underline">
                  <Trash2 size={12} /> Clear All
                </button>
              </div>
              <ul className="space-y-2">
                {memories.map((memory, index) => (
                  <li key={index} className="text-[13px] text-primary bg-gray-50 border border-secondary rounded-lg p-2.5">
                    {memory}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-lab text-xs">No memories saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
