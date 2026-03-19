'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';

export default function ProfilPage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Max Mondlicht');
  const [bio, setBio] = useState('Spiritueller Suchender und begeisterter Schüler der Metaphysik. Auf der Reise zur inneren Erleuchtung.');
  const [email] = useState('max@example.com');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mein Profil</h1>
        <p className="text-slate-400">Verwalte deine persönlichen Informationen.</p>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8">
        <div className="flex items-start gap-6 mb-8">
          <Avatar name={name} size="xl" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-violet-400 text-sm">Premium Mitglied</p>
            <p className="text-slate-400 text-sm mt-2">{email}</p>
            <button
              onClick={() => setEditing(!editing)}
              className="mt-4 text-sm border border-violet-500 text-violet-400 hover:bg-violet-500/10 px-4 py-1.5 rounded-lg transition-all"
            >
              {editing ? 'Abbrechen' : 'Profil bearbeiten'}
            </button>
          </div>
        </div>

        {editing ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setEditing(false); }}>
            <Input
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Textarea
              label="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
            />
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
            >
              Änderungen speichern
            </button>
          </form>
        ) : (
          <div className="border-t border-[#1e1e2e] pt-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Bio</h3>
            <p className="text-slate-300">{bio}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Mitglied seit', value: 'Feb 2024' },
          { label: 'Kurse', value: '3' },
          { label: 'Zertifikate', value: '1' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
