export default function SearchSkeleton() {
  return (
    <div className="w-full rounded-xl p-3 mb-2 bg-gray-100 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2 min-w-0 flex-1">
          <div className="w-4 h-4 mt-1 rounded bg-gray-300 shrink-0" />

          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="h-3 w-32 bg-gray-300 rounded" />
            <div className="h-2.5 w-full bg-gray-200 rounded" />
          </div>
        </div>

        <div className="h-3 w-8 bg-gray-300 rounded-full shrink-0" />
      </div>
    </div>
  );
}
