import { MemberSidebar } from '@/components/layout/MemberSidebar';
import { MemberTopbar } from '@/components/layout/MemberTopbar';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <MemberSidebar />
      <div className="flex-1 flex flex-col">
        <MemberTopbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

