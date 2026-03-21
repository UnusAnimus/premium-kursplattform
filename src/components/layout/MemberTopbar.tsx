'use client';
import { useSession } from 'next-auth/react';
import { getInitials } from '@/lib/utils';

interface MemberTopbarProps {
  onMenuToggle?: () => void;
}

export function MemberTopbar({ onMenuToggle }: MemberTopbarProps) {
  const { data: session } = useSession();

  const name = session?.user?.name || 'Mitglied';
  const initials = getInitials(name);

  return (
    <header className="h-16 border-b border-[var(--border-base)] bg-[var(--bg-surface)] flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          aria-label="Menü öffnen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-[var(--text-muted)] text-sm hidden sm:block">Mitgliederbereich</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <div className="hidden sm:block">
          <p className="text-[var(--text-primary)] text-sm font-medium">{name}</p>
          <p className="text-[var(--text-muted)] text-xs">Premium Mitglied</p>
        </div>
      </div>
    </header>
  );
}
