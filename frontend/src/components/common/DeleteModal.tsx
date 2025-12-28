type DeleteVariant = "delete-chat" | "delete-all";

const CONFIG: Record<
  DeleteVariant,
  {
    title: string;
    description: string;
    confirmLabel: string;
  }
> = {
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <p className="mb-5 text-sm text-gray-600">{description}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="px-4 py-1.5 rounded bg-gray-200">
            Cancel
          </button>

          <button onClick={onConfirm} disabled={loading} className="px-4 py-1.5 rounded bg-red-600 text-white">
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
