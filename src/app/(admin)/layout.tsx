import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[#1e1e2e] bg-[#13131a]/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-sm">Admin-Bereich</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
              SS
            </div>
            <div>
              <p className="text-white text-sm font-medium">Sophia Sternbild</p>
              <p className="text-slate-500 text-xs">Administrator</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
