export default function MemberLoading() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-[var(--border-base)] rounded-xl" />
        <div className="h-4 w-96 bg-[var(--border-base)] rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6 space-y-3">
              <div className="h-5 bg-[var(--border-base)] rounded w-2/3" />
              <div className="h-4 bg-[var(--border-base)] rounded w-full" />
              <div className="h-4 bg-[var(--border-base)] rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
