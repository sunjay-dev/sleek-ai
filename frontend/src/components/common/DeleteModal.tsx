type DeleteVariant = "delete-chat" | "delete-all" | "delete-memory" | "delete-all-memories";

const CONFIG = {
  "delete-chat": {
    title: "Delete chat",
    description: "Are you sure you want to delete this chat?",
    confirmLabel: "Delete",
  },
  "delete-all": {
    title: "Delete all chats",
    description: "This will permanently delete all your chats.",
    confirmLabel: "Delete all",
  },
  "delete-memory": {
    title: "Delete memory",
    description: "This will make the AI forget this specific fact.",
    confirmLabel: "Delete",
  },
  "delete-all-memories": {
    title: "Clear all memories",
    description: "This will permanently remove all facts the AI has learned about you.",
    confirmLabel: "Clear all",
  },
};

type DeleteModalProps = {
  variant: DeleteVariant;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function DeleteModal({ variant, onCancel, onConfirm, loading = false }: DeleteModalProps) {
  const { title, description, confirmLabel } = CONFIG[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white text-primary rounded-lg shadow-lg p-6 w-11/12 max-w-md space-y-3">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="text-sm text-gray-600">{description}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="px-4 py-1.5 rounded-full hover:bg-gray-200/60">
            Cancel
          </button>

          <button onClick={onConfirm} disabled={loading} className="px-4 py-1.5 rounded-full  bg-red-600 text-white">
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
