import { MemberSidebar } from '@/components/layout/MemberSidebar';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <MemberSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-[var(--border-base)] bg-[var(--bg-surface)] flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] text-sm">Mitgliederbereich</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
              MM
            </div>
            <div>
              <p className="text-[var(--text-primary)] text-sm font-medium">Max Mondlicht</p>
              <p className="text-[var(--text-muted)] text-xs">Premium Mitglied</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

