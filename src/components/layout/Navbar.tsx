'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#pfade',   label: 'Lehrpfade' },
    { href: '#kurse',   label: 'Kurse'     },
    { href: '#preise',  label: 'Preise'    },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(5, 5, 8, 0.88)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201, 168, 76, 0.08)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                color: 'var(--obsidian)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            >
              A
            </div>
            <span
              className="text-sm font-bold tracking-[0.12em] hidden sm:block"
              style={{ color: 'var(--gold-light)', letterSpacing: '0.12em' }}
            >
              ARKANUM
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group transition-colors duration-300"
                style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--pearl-muted)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-light)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-400"
                  style={{ background: 'var(--gold)', opacity: 0.6 }}
                />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  data-testid={isAdmin ? 'nav-admin-link' : 'nav-dashboard-link'}
                  className="hidden sm:block text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                  style={{ color: 'var(--pearl-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
                >
                  {isAdmin ? 'Admin' : 'Dashboard'}
                </Link>
                {!isAdmin && (
                  <Link
                    href="/meine-kurse"
                    className="hidden sm:block text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                    style={{ color: 'var(--pearl-muted)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
                  >
                    Meine Kurse
                  </Link>
                )}
                <button
                  data-testid="nav-logout"
                  className="hidden sm:block px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300"
                  style={{
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: 'var(--gold)',
                    background: 'rgba(201,168,76,0.04)',
                  }}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
                  }}
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  data-testid="nav-login-link"
                  className="hidden sm:block text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
                  style={{ color: 'var(--pearl-muted)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pearl-muted)'; }}
                >
                  Anmelden
                </Link>
                <Link href="/login" data-testid="nav-start-link">
                  <button
                    className="px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                      color: 'var(--obsidian)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #fff8e8, var(--gold-light))';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, var(--gold-light), var(--gold))';
                    }}
                  >
                    Eintreten
                  </button>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 transition-colors duration-200"
              style={{ color: 'var(--pearl-muted)' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-400"
          style={{ maxHeight: menuOpen ? '320px' : '0' }}
        >
          <div
            className="flex flex-col gap-1 py-4"
            style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
                style={{ color: 'var(--pearl-muted)' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  href={isAdmin ? '/admin' : '/dashboard'}
                  className="px-2 py-3 text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--gold)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {isAdmin ? 'Admin-Bereich' : 'Dashboard'}
                </Link>
                {!isAdmin && (
                  <Link
                    href="/meine-kurse"
                    className="px-2 py-3 text-xs font-semibold tracking-widest uppercase"
                    style={{ color: 'var(--pearl-muted)' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    Meine Kurse
                  </Link>
                )}
                <button
                  className="px-2 py-3 text-xs font-semibold tracking-widest uppercase text-left"
                  style={{ color: 'var(--pearl-muted)' }}
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                >
                  Abmelden
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-2 py-3 text-xs font-semibold tracking-widest uppercase"
                style={{ color: 'var(--gold)' }}
                onClick={() => setMenuOpen(false)}
              >
                Anmelden
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

