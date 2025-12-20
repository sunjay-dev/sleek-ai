type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function DeleteChat({ open, onCancel, onConfirm, loading }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Delete chat</h2>
        <p className="mb-5 text-sm text-gray-600">Are you sure you want to delete this chat?</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded bg-gray-200 text-gray-700">
            Cancel
          </button>

          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
