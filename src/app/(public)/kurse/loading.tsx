export default function KurseLoading() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Header skeleton */}
      <div className="border-b border-[#1e1e2e] bg-[#13131a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="h-6 w-32 bg-[#1e1e2e] rounded-full mb-6 animate-pulse" />
          <div className="h-10 w-96 bg-[#1e1e2e] rounded-xl mb-4 animate-pulse" />
          <div className="h-5 w-80 bg-[#1e1e2e] rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-3 mb-8 flex-wrap">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-24 bg-[#13131a] border border-[#1e1e2e] rounded-lg animate-pulse" />
          ))}
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-[#1e1e2e]" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-[#1e1e2e] rounded w-3/4" />
                <div className="h-4 bg-[#1e1e2e] rounded w-full" />
                <div className="h-4 bg-[#1e1e2e] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
