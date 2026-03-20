'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';

export default function ProfilPage() {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? '');
      setEmail(session.user.email ?? '');
    }

    // Load full profile from API
    fetch('/api/user/profile')
      .then(r => r.ok ? r.json() : null)
      .then((data: { user?: { name: string; email: string; bio?: string; createdAt: string } } | null) => {
        if (data?.user) {
          setName(data.user.name);
          setEmail(data.user.email);
          setBio(data.user.bio ?? '');
          const d = new Date(data.user.createdAt);
          setMemberSince(d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }));
        }
      })
      .catch(() => {/* ignore, use session data */});
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      });

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        setSaveError(json.error ?? 'Speichern fehlgeschlagen.');
        return;
      }

      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Mein Profil</h1>
        <p className="text-[var(--text-secondary)]">Verwalte deine persönlichen Informationen.</p>
      </div>

      {saveSuccess && (
        <div className="status-success text-sm px-4 py-3 rounded-xl">
          ✓ Profil erfolgreich gespeichert.
        </div>
      )}

      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 shadow-[var(--shadow-sm)]">
        <div className="flex items-start gap-6 mb-8">
          <Avatar name={name || 'U'} size="xl" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{name}</h2>
            <p className="text-[var(--badge-brand-text)] text-sm">Premium Mitglied</p>
            <p className="text-[var(--text-secondary)] text-sm mt-2">{email}</p>
            <button
              onClick={() => { setEditing(!editing); setSaveError(''); }}
              className="mt-4 text-sm border border-[var(--badge-brand-border)] text-[var(--badge-brand-text)] hover:bg-[var(--badge-brand-bg)] px-4 py-1.5 rounded-lg transition-all"
            >
              {editing ? 'Abbrechen' : 'Profil bearbeiten'}
            </button>
          </div>
        </div>

        {editing ? (
          <form className="space-y-4" onSubmit={handleSave}>
            {saveError && (
              <p className="status-error text-sm rounded-lg px-4 py-2">{saveError}</p>
            )}
            <Input
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Textarea
              label="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
            >
              {saving ? 'Speichern…' : 'Änderungen speichern'}
            </button>
          </form>
        ) : (
          <div className="border-t border-[var(--border-base)] pt-6">
            <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">Bio</h3>
            {bio
              ? <p className="text-[var(--text-secondary)]">{bio}</p>
              : <p className="text-[var(--text-muted)] italic">Noch keine Bio angegeben.</p>
            }
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Mitglied seit', value: memberSince || '—' },
          { label: 'Kurse', value: '3' },
          { label: 'Zertifikate', value: '1' },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-[var(--text-primary)] mb-1">{stat.value}</div>
            <div className="text-[var(--text-secondary)] text-xs">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
