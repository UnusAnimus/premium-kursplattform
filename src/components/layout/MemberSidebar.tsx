'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/meine-kurse', label: 'Meine Kurse', icon: '◈' },
  { href: '/lernfortschritt', label: 'Lernfortschritt', icon: '▲' },
  { href: '/ki-assistent', label: 'KI-Assistent', icon: '✦' },
  { href: '/profil', label: 'Profil', icon: '◎' },
  { href: '/einstellungen', label: 'Einstellungen', icon: '⚙' },
  { href: '/abo', label: 'Abo verwalten', icon: '◆' },
];

export function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#13131a] border-r border-[#1e1e2e] flex flex-col">
      <div className="p-6 border-b border-[#1e1e2e]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl text-violet-400">⬡</span>
          <span className="font-bold text-white text-sm">Arkanum Akademie</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Mitgliederbereich</p>
        <ul className="space-y-1">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
      <div className="p-4 border-t border-[#1e1e2e]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <span>←</span>
          <span>Zur Startseite</span>
        </Link>
      </div>
    </aside>
  );
}
