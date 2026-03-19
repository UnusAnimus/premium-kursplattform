import { mockUsers } from '@/lib/data';

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/30',
  member: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  instructor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

export default function AdminNutzerPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Nutzer verwalten</h1>
          <p className="text-slate-400">{mockUsers.length} Nutzer (Demo)</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          + Nutzer einladen
        </button>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['Nutzer', 'Rolle', 'Abo', 'Beigetreten', 'Letzter Login', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {mockUsers.map(user => (
              <tr key={user.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${roleColors[user.role]}`}>{user.role}</span>
                </td>
                <td className="p-4">
                  {user.subscription ? (
                    <span className="text-xs text-white capitalize">{user.subscription.plan}</span>
                  ) : (
                    <span className="text-xs text-slate-500">—</span>
                  )}
                </td>
                <td className="p-4 text-slate-400 text-xs">{user.joinedAt}</td>
                <td className="p-4 text-slate-400 text-xs">{user.lastLoginAt}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-xs text-slate-400 hover:text-white transition-colors">Bearbeiten</button>
                    <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Sperren</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
