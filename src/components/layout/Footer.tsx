'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Footer() {
  const year = new Date().getFullYear();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  const akademieLinks = [
    { href: '/ueber-uns', label: 'Über uns' },
    { href: '/preise', label: 'Preise' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  if (isLoggedIn) {
    if (isAdmin) {
      akademieLinks.push({ href: '/admin', label: 'Admin-Bereich' });
    } else {
      akademieLinks.push({ href: '/dashboard', label: 'Mitgliederbereich' });
    }
  } else {
    akademieLinks.push({ href: '/login', label: 'Mitglied werden' });
  }

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-base)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="font-bold text-[var(--text-primary)] text-lg">Arkanum Akademie</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              Entdecke transformatives Wissen in Metaphysik, Bewusstseinsentwicklung und esoterischen Traditionen.
            </p>
            <div className="flex items-center gap-3">
              {['✦', '◈', '⬡'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg border border-[var(--border-base)] flex items-center justify-center text-[var(--text-muted)] hover:text-violet-400 hover:border-violet-500 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kurse */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Kurse</h3>
            <ul className="space-y-3">
              {[
                { href: '/kurse', label: 'Alle Kurse' },
                { href: '/kurse/metaphysik-bewusstsein', label: 'Metaphysik' },
                { href: '/kurse/astrologie-meisterkurs', label: 'Astrologie' },
                { href: '/kurse/quantenheilung', label: 'Heilung' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--text-secondary)] hover:text-violet-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akademie */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Akademie</h3>
            <ul className="space-y-3">
              {akademieLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[var(--text-secondary)] hover:text-violet-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-[var(--text-secondary)] hover:text-violet-400 text-sm transition-colors"
                  >
                    Abmelden
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4">Rechtliches</h3>
            <ul className="space-y-3">
              {[
                { id: 'impressum', href: '#', label: 'Impressum' },
                { id: 'datenschutz', href: '#', label: 'Datenschutz' },
                { id: 'agb', href: '#', label: 'AGB' },
                { id: 'widerruf', href: '#', label: 'Widerruf' },
              ].map(link => (
                <li key={link.id}>
                  <Link href={link.href} className="text-[var(--text-secondary)] hover:text-violet-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-base)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {year} Arkanum Akademie. Alle Rechte vorbehalten.
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Mit <span className="text-violet-400">✦</span> handgefertigt für Suchende
          </p>
        </div>
      </div>
    </footer>
  );
}
