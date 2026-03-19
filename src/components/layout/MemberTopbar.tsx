'use client';
import { useSession } from 'next-auth/react';
import { getInitials } from '@/lib/utils';

export function MemberTopbar() {
  const { data: session } = useSession();

  const name = session?.user?.name || 'Mitglied';
  const initials = getInitials(name);

  return (
    <header className="h-16 border-b border-[var(--border-base)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-muted)] text-sm">Mitgliederbereich</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-[var(--text-primary)] text-sm font-medium">{name}</p>
          <p className="text-[var(--text-muted)] text-xs">Premium Mitglied</p>
        </div>
      </div>
    </header>
  );
}
