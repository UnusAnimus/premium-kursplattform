export default function AdminLoading() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-[var(--border-base)] rounded-xl" />
        <div className="h-4 w-96 bg-[var(--border-base)] rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6 space-y-3">
              <div className="h-5 bg-[var(--border-base)] rounded w-1/2" />
              <div className="h-8 bg-[var(--border-base)] rounded w-1/3" />
            </div>
          ))}
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--border-base)] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
