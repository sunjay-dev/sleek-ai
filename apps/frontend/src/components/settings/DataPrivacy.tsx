type Props = {
  DeleteChatIntent: () => void;
};
export default function DataPrivacy({ DeleteChatIntent }: Props) {
  return (
    <section className="sm:py-4 py-6 px-6">
      <h3 className="text-lg font-normal pb-2 border-b border-gray-500/20 mb-4">Data Privacy</h3>

      <p className="text-xs text-gray-lab mb-6 leading-relaxed">Manage your conversation history and data retention settings.</p>

      <div className="flex items-center justify-between py-3 border border-gray-500/20 rounded-lg p-3">
        <div className="pr-4">
          <h4 className="text-sm font-medium text-primary mb-0.5">Delete all chats</h4>
          <p className="text-xs text-gray-lab leading-relaxed">Permanently delete all conversation history.</p>
        </div>

        <button
          onClick={DeleteChatIntent}
          className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:opacity-80"
        >
          Delete all
        </button>
      </div>
    </section>
  );
}
