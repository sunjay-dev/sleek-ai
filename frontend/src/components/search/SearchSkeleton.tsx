export default function SearchSkeleton() {
  return (
    <div className="w-full rounded-xl p-3 mb-2 bg-gray-100 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-4 h-4 mt-1 rounded bg-gray-300" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-3 w-32 bg-gray-300 rounded" />
          <div className="h-2.5 w-4/5 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
