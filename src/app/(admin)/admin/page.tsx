'use client';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface AdminStats {
  userCount: number;
  courseCount: number;
  enrollmentCount: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.ok ? r.json() as Promise<{ users: AdminStats['recentUsers'] }> : null),
      fetch('/api/admin/courses').then(r => r.ok ? r.json() as Promise<{ courses: unknown[] }> : null),
    ])
      .then(([usersData, coursesData]) => {
        setStats({
          userCount: usersData?.users?.length ?? 0,
          courseCount: coursesData?.courses?.length ?? 0,
          enrollmentCount: 0,
          recentUsers: (usersData?.users ?? []).slice(0, 5),
        });
      })
      .catch(() => {/* ignore */})
      .finally(() => setLoading(false));
  }, []);

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400',
    member: 'bg-violet-500/10 text-violet-400',
    instructor: 'bg-amber-500/10 text-amber-400',
  };
  const roleLabels: Record<string, string> = { admin: 'Admin', member: 'Mitglied', instructor: 'Dozent' };

  const metrics = [
    { label: 'Registrierte Nutzer', value: loading ? '—' : (stats?.userCount ?? 0).toLocaleString('de-DE'), icon: '◎', color: 'text-emerald-400' },
    { label: 'Aktive Kurse', value: loading ? '—' : (stats?.courseCount ?? 0).toString(), icon: '◈', color: 'text-violet-400' },
    { label: 'Einschreibungen', value: loading ? '—' : (stats?.enrollmentCount ?? 0).toLocaleString('de-DE'), icon: '✦', color: 'text-amber-400' },
    { label: 'Gesamtumsatz', value: formatPrice(0), icon: '◆', color: 'text-emerald-400' },
    { label: 'Aktive Abos', value: '—', icon: '▲', color: 'text-emerald-400' },
    { label: 'Abschlussrate', value: '—', icon: '◐', color: 'text-slate-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Admin-Dashboard</h1>
        <p className="text-slate-400">Übersicht über die Arkanum Akademie</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl text-violet-400">{m.icon}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
            <div className="text-slate-400 text-xs">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent users */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#1e1e2e]">
            <h2 className="text-lg font-semibold text-white">Neueste Nutzer</h2>
            <Link href="/admin/nutzer" className="text-violet-400 hover:text-violet-300 text-sm">Alle →</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm">Lädt…</div>
          ) : (stats?.recentUsers ?? []).length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Noch keine Nutzer registriert.</div>
          ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[#1e1e2e]">
              {(stats?.recentUsers ?? []).map(user => (
                <tr key={user.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${roleColors[user.role] ?? roleColors['member']}`}>
                      {roleLabels[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-5">Schnellaktionen</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/admin/kurse', icon: '◈', label: 'Kurs hinzufügen' },
              { href: '/admin/nutzer', icon: '◎', label: 'Nutzer verwalten' },
              { href: '/admin/zahlungen', icon: '◆', label: 'Zahlungen' },
              { href: '/admin/theme', icon: '◐', label: 'Theme anpassen' },
              { href: '/admin/ki', icon: '✦', label: 'KI-Einstellungen' },
              { href: '/admin/system', icon: '⚙', label: 'System' },
            ].map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-[#0a0a0f] rounded-xl hover:bg-[#1a1a24] transition-all border border-[#1e1e2e] hover:border-violet-500/50 group"
              >
                <span className="text-xl text-violet-400">{action.icon}</span>
                <span className="text-slate-300 text-sm group-hover:text-white">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
