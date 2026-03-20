'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function Footer() {
  const year = new Date().getFullYear();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  const akademieLinks = useMemo(() => {
    const links = [
      { href: '/ueber-uns', label: 'Über uns' },
      { href: '/preise', label: 'Preise' },
      { href: '/kontakt', label: 'Kontakt' },
    ];
    if (isLoggedIn) {
      links.push({ href: isAdmin ? '/admin' : '/dashboard', label: isAdmin ? 'Admin-Bereich' : 'Mitgliederbereich' });
    } else {
      links.push({ href: '/login', label: 'Mitglied werden' });
    }
    return links;
  }, [isLoggedIn, isAdmin]);

  return (
    <footer style={{ background: '#050508', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                  color: 'var(--obsidian)',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                A
              </div>
              <span className="font-bold tracking-[0.12em] text-sm" style={{ color: 'var(--gold-light)' }}>
                ARKANUM
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--pearl-muted)' }}>
              Transformatives Wissen in Metaphysik, Bewusstseinsentwicklung und hermetischen Traditionen.
            </p>
            <div className="flex items-center gap-3">
              {['✦', '◈', '⬡'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center text-sm transition-all duration-300"
                  style={{
                    border: '1px solid rgba(201,168,76,0.15)',
                    color: 'var(--pearl-muted)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.15)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Kurse */}
          <div>
            <h3 className="label-text tracking-[0.2em] mb-5" style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>
              Kurse
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/kurse',                          label: 'Alle Kurse'  },
                { href: '/kurse/metaphysik-bewusstsein',   label: 'Metaphysik'  },
                { href: '/kurse/astrologie-meisterkurs',   label: 'Astrologie'  },
                { href: '/kurse/quantenheilung',           label: 'Heilung'     },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--pearl-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akademie */}
          <div>
            <h3 className="label-text tracking-[0.2em] mb-5" style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>
              Akademie
            </h3>
            <ul className="space-y-3">
              {akademieLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--pearl-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--pearl-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
                  >
                    Abmelden
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="label-text tracking-[0.2em] mb-5" style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>
              Rechtliches
            </h3>
            <ul className="space-y-3">
              {[
                { id: 'impressum', href: '#', label: 'Impressum' },
                { id: 'datenschutz', href: '#', label: 'Datenschutz' },
                { id: 'agb', href: '#', label: 'AGB' },
                { id: 'widerruf', href: '#', label: 'Widerruf' },
              ].map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--pearl-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs" style={{ color: 'var(--pearl-muted)', letterSpacing: '0.05em' }}>
            © {year} Arkanum Akademie — Alle Rechte vorbehalten
          </p>
          <p className="text-xs" style={{ color: 'rgba(201,168,76,0.4)', letterSpacing: '0.08em' }}>
            Mit ✦ handgefertigt für Suchende
          </p>
        </div>
      </div>
    </footer>
  );
}

