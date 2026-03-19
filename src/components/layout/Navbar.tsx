'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/kurse', label: 'Kurse' },
    { href: '/ueber-uns', label: 'Über uns' },
    { href: '/preise', label: 'Preise' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#1e1e2e] shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl text-violet-400 group-hover:text-violet-300 transition-colors">⬡</span>
            <span className="font-bold text-white text-lg tracking-tight">
              Arkanum <span className="text-violet-400">Akademie</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors hover:text-violet-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-[#1e1e2e] flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500 transition-all"
              aria-label="Theme wechseln"
            >
              {isDark ? '☀' : '🌙'}
            </button>
            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors px-4 py-2"
                  >
                    Admin ✦
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-[#1e1e2e] hover:bg-[#2a2a3e] border border-[#2a2a3e] text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
                >
                  Anmelden
                </Link>
                <Link
                  href="/login"
                  className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/25"
                >
                  Mitglied werden
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#1e1e2e] px-4 py-4">
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white font-medium transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#1e1e2e] flex flex-col gap-3">
              {session ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-medium transition-colors" onClick={() => setMobileOpen(false)}>
                      Admin ✦
                    </Link>
                  )}
                  <Link href="/dashboard" className="text-slate-300 hover:text-white font-medium transition-colors" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false); }}
                    className="text-left text-slate-300 hover:text-white font-medium transition-colors"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-300 hover:text-white font-medium transition-colors" onClick={() => setMobileOpen(false)}>
                    Anmelden
                  </Link>
                  <Link
                    href="/login"
                    className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Mitglied werden
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
