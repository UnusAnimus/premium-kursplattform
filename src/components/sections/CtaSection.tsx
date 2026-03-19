'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function CtaSection() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  const ctaHref = isLoggedIn
    ? isAdmin ? '/admin' : '/dashboard'
    : '/login';

  const ctaLabel = isLoggedIn ? 'Zum Dashboard ✦' : 'Kostenlos starten ✦';

  return (
    <section className="py-24 bg-gradient-to-b from-[var(--bg-base)] to-violet-950/10 dark:to-violet-950/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="text-6xl mb-6">⬡</div>
        <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Bereit für deine{' '}
          <span className="gradient-text">
            Transformation?
          </span>
        </h2>
        <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
          Tritt der Arkanum Akademie bei und beginne noch heute deine Reise zu tieferem Wissen und spirituellem Wachstum.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ctaHref}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/30 text-lg"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/kurse"
            className="border border-[var(--border-strong)] hover:border-violet-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold px-8 py-4 rounded-lg transition-all text-lg"
          >
            Kurse entdecken
          </Link>
        </div>
      </div>
    </section>
  );
}
