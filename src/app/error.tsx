'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6 opacity-40">⚠</div>
        <h1 className="text-3xl font-bold text-white mb-3">Etwas ist schiefgelaufen</h1>
        <p className="text-slate-400 mb-8">
          Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut oder kehre zur Startseite zurück.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-[#13131a] border border-[#1e1e2e] hover:border-violet-500/50 text-slate-300 hover:text-white rounded-xl font-medium transition-all"
          >
            Zur Startseite
          </Link>
        </div>
        {error.digest && (
          <p className="text-slate-600 text-xs mt-6">Fehlercode: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
