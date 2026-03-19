'use client';
import { useSession } from 'next-auth/react';

export function AdminTopbar() {
  const { data: session } = useSession();

  const name = session?.user?.name || 'Admin';
  const initials = name
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 border-b border-[var(--border-base)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-muted)] text-sm">Admin-Bereich</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-[var(--text-primary)] text-sm font-medium">{name}</p>
          <p className="text-[var(--text-muted)] text-xs">Administrator</p>
        </div>
      </div>
    </header>
  );
}
