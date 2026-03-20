'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/meine-kurse', label: 'Meine Kurse', icon: '◈' },
  { href: '/lernfortschritt', label: 'Lernfortschritt', icon: '▲' },
  { href: '/ki-assistent', label: 'KI-Assistent', icon: '✦' },
  { href: '/profil', label: 'Profil', icon: '◎' },
  { href: '/einstellungen', label: 'Einstellungen', icon: '⚙' },
  { href: '/abo', label: 'Abo verwalten', icon: '◆' },
];

interface MemberSidebarProps {
  onClose?: () => void;
}

export function MemberSidebar({ onClose }: MemberSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <aside className="w-64 min-h-screen bg-[var(--bg-surface)] border-r border-[var(--border-base)] flex flex-col">
      <div className="p-6 border-b border-[var(--border-base)] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="font-bold text-[var(--text-primary)] text-sm">Arkanum Akademie</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md transition-colors"
            aria-label="Menü schließen"
          >
            ✕
          </button>
        )}
      </div>

      {/* User info */}
      {session?.user && (
        <div className="px-4 py-4 border-b border-[var(--border-base)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-400 text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-[var(--text-primary)] text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-[var(--text-muted)] text-xs truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4 px-3">Mitgliederbereich</p>
        <ul className="space-y-1">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-600 dark:text-violet-300 border border-violet-500/30'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-[var(--border-base)] space-y-1">
        {session?.user?.role === 'admin' && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-amber-500 hover:text-amber-400 hover:bg-amber-500/5 transition-all"
          >
            <span>⚡</span>
            <span>Admin-Bereich</span>
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all text-left"
        >
          <span>↩</span>
          <span>Abmelden</span>
        </button>
      </div>
    </aside>
  );
}
