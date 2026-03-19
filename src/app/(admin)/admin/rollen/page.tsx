export default function AdminRollenPage() {
  const roles = [
    {
      name: 'Administrator',
      slug: 'admin',
      color: 'text-red-400 bg-red-500/10 border-red-500/30',
      users: 1,
      permissions: ['Alle Rechte', 'Nutzer verwalten', 'Kurse verwalten', 'Zahlungen einsehen', 'Theme anpassen', 'Systemeinstellungen'],
    },
    {
      name: 'Instructor',
      slug: 'instructor',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      users: 1,
      permissions: ['Eigene Kurse verwalten', 'Lektionen erstellen', 'Kommentare moderieren', 'Analysen einsehen'],
    },
    {
      name: 'Mitglied',
      slug: 'member',
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      users: 3,
      permissions: ['Kurse ansehen', 'Lektionen besuchen', 'Community teilnehmen', 'KI-Assistent nutzen'],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Rollen & Zugriffe</h1>
        <p className="text-slate-400">Berechtigungen für alle Nutzerrollen</p>
      </div>

      <div className="space-y-6">
        {roles.map(role => (
          <div key={role.slug} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm px-3 py-1.5 rounded-full border font-medium ${role.color}`}>{role.name}</span>
                <span className="text-slate-500 text-sm">{role.users} Nutzer</span>
              </div>
              <button className="text-sm text-slate-400 hover:text-white transition-colors">Bearbeiten</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {role.permissions.map((perm, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 text-xs">✓</span>
                  {perm}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
