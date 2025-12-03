export default function MessageLoader() {
  return (
    <div className="flex justify-start">
      <div className="max-w-full text-sm md:p-4 rounded-xl w-full">
        <div className="space-y-2">
          <div className="h-4 bg-neutral-700 rounded w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent animate-shimmer -translate-x-full" />
          </div>
          <div className="h-4 bg-neutral-700 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent animate-shimmer -translate-x-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
