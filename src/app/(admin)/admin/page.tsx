import { adminStats, mockUsers } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboard() {
  const recentUsers = mockUsers.slice(0, 5);

  const metrics = [
    { label: 'Gesamtumsatz', value: formatPrice(adminStats.totalRevenue), icon: '◆', change: '+12%', color: 'text-emerald-400' },
    { label: 'Monatlicher Umsatz', value: formatPrice(adminStats.monthlyRevenue), icon: '▲', change: '+8%', color: 'text-emerald-400' },
    { label: 'Registrierte Nutzer', value: adminStats.totalUsers.toLocaleString('de-DE'), icon: '◎', change: '+245', color: 'text-emerald-400' },
    { label: 'Aktive Abos', value: adminStats.activeSubscriptions.toLocaleString('de-DE'), icon: '✦', change: '+89', color: 'text-emerald-400' },
    { label: 'Kurse', value: adminStats.totalCourses.toString(), icon: '◈', change: '', color: 'text-slate-400' },
    { label: 'Abschlussrate', value: `${adminStats.completionRate}%`, icon: '◐', change: '+3%', color: 'text-emerald-400' },
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
              {m.change && <span className={`text-xs font-medium ${m.color}`}>{m.change}</span>}
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
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[#1e1e2e]">
              {recentUsers.map(user => (
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
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                      user.role === 'instructor' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-violet-500/10 text-violet-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{user.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
