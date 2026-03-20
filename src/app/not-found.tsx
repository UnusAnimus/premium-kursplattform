import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <div className="text-4xl mb-6 opacity-30">◈</div>
        <h1 className="text-2xl font-bold text-white mb-3">Seite nicht gefunden</h1>
        <p className="text-slate-400 mb-8">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
          >
            Zur Startseite
          </Link>
          <Link
            href="/kurse"
            className="px-6 py-3 bg-[#13131a] border border-[#1e1e2e] hover:border-violet-500/50 text-slate-300 hover:text-white rounded-xl font-medium transition-all"
          >
            Kurse entdecken
          </Link>
        </div>
      </div>
    </div>
  );
}
