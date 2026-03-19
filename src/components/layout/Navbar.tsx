'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { data: session } = useSession();

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#kurse', label: 'Kurse' },
    { href: '#features', label: 'Vorteile' },
    { href: '#preise', label: 'Preise' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-base)] shadow-[var(--shadow-sm)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/30 transition-shadow">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">Arkanum Akademie</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-400 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all duration-200"
              aria-label="Theme wechseln"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isLoggedIn ? (
              <>
                <Link href={isAdmin ? '/admin' : '/dashboard'}>
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    {isAdmin ? 'Admin-Bereich' : 'Dashboard'}
                  </Button>
                </Link>
                {!isAdmin && (
                  <Link href="/meine-kurse">
                    <Button variant="ghost" size="sm" className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                      Meine Kurse
                    </Button>
                  </Link>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Abmelden
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    Anmelden
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-violet-500/25">
                    Kostenlos starten
                  </Button>
                </Link>
              </>
            )}
            <button
              className="md:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-80 pb-4' : 'max-h-0'}`}>
          <div className="flex flex-col gap-1 pt-2 border-t border-[var(--border-base)]">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="px-4 py-3 text-sm font-medium text-violet-400 hover:text-violet-300 rounded-xl transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {isAdmin ? 'Admin-Bereich' : 'Dashboard'}
                </Link>
                {!isAdmin && (
                  <Link
                    href="/meine-kurse"
                    className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Meine Kurse
                  </Link>
                )}
                <button
                  className="px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors text-left"
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                >
                  Abmelden
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-3 text-sm font-medium text-violet-400 hover:text-violet-300 rounded-xl transition-colors" onClick={() => setMenuOpen(false)}>
                Anmelden / Registrieren
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
