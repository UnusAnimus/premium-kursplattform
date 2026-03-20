'use client';
import { useState, useEffect } from 'react';

interface DBUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  subscription: { plan: string; status: string } | null;
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/10 text-red-400 border-red-500/30',
  member: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  instructor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  member: 'Mitglied',
  instructor: 'Dozent',
};

export default function AdminNutzerPage() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then((data: { users?: DBUser[]; error?: string }) => {
        if (data.users) setUsers(data.users);
        else setError(data.error ?? 'Nutzerdaten konnten nicht geladen werden.');
      })
      .catch(() => setError('Verbindungsfehler.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setRoleChanging(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json() as { user?: DBUser; error?: string };
      if (data.user) {
        const updatedRole = data.user.role;
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updatedRole } : u));
      }
    } catch {
      // ignore
    } finally {
      setRoleChanging(null);
      setEditingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Nutzer verwalten</h1>
          <p className="text-[var(--text-secondary)]">{loading ? 'Lädt…' : `${users.length} Nutzer`}</p>
        </div>
      </div>

      {error && (
        <div className="status-error text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">Nutzerdaten werden geladen…</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">Noch keine Nutzer registriert.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-base)] bg-[var(--bg-surface-raised)]">
              <tr>
                {['Nutzer', 'Rolle', 'Abo', 'Beigetreten', 'Letzter Login', 'Aktionen'].map(h => (
                  <th key={h} className="text-left text-[var(--text-secondary)] font-medium p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-base)]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-[var(--row-hover)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-medium">{user.name}</p>
                        <p className="text-[var(--text-muted)] text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {editingId === user.id ? (
                      <select
                        defaultValue={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        disabled={roleChanging === user.id}
                        className="bg-[var(--input-bg)] border border-[var(--border-strong)] text-[var(--text-primary)] text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      >
                        <option value="member">Mitglied</option>
                        <option value="instructor">Dozent</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${roleColors[user.role] ?? roleColors['member']}`}>
                        {roleLabels[user.role] ?? user.role}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {user.subscription ? (
                      <span className="text-xs text-[var(--text-primary)] capitalize">{user.subscription.plan}</span>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="p-4 text-[var(--text-secondary)] text-xs">
                    {new Date(user.createdAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="p-4 text-[var(--text-secondary)] text-xs">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('de-DE') : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {editingId === user.id ? 'Abbrechen' : 'Rolle ändern'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
