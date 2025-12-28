import { useState } from "react";

type RenameModalProps = {
  onClose: () => void;
  onRename: (newTitle: string) => void;
  currentTitle: string;
};

export default function RenameChatModal({ onClose, onRename, currentTitle }: RenameModalProps) {
  const [title, setTitle] = useState(currentTitle);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onRename(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <form onSubmit={handleSubmit} className="bg-white text-primary rounded-lg space-y-4 shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-medium">Rename this chat</h2>

        <input
          type="text"
          autoFocus={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-500/20 rounded px-3 py-2 text-sm outline-none"
          placeholder="New chat title"
        />

        <div className="flex justify-end gap-3 text-sm">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md hover:bg-gray-100 active:bg-gray-100">
            Cancel
          </button>

          <button type="submit" className="px-4 py-2 rounded-md bg-[#1c1c1c]/90 hover:opacity-90 active:opacity-90 text-white">
            Rename
          </button>
        </div>
      </form>
    </div>
  );
}
