'use client';
import { useState } from 'react';

const pages = [
  { id: 'home', title: 'Startseite', slug: '/', status: 'published', updatedAt: '2024-06-20' },
  { id: 'about', title: 'Über uns', slug: '/ueber-uns', status: 'published', updatedAt: '2024-06-15' },
  { id: 'pricing', title: 'Preise', slug: '/preise', status: 'published', updatedAt: '2024-06-10' },
  { id: 'contact', title: 'Kontakt', slug: '/kontakt', status: 'published', updatedAt: '2024-06-05' },
  { id: 'imprint', title: 'Impressum', slug: '/impressum', status: 'draft', updatedAt: '2024-05-20' },
  { id: 'privacy', title: 'Datenschutz', slug: '/datenschutz', status: 'published', updatedAt: '2024-05-15' },
];

export default function AdminSeitenPage() {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Seitenverwaltung</h1>
          <p className="text-slate-400">Verwalte statische Seiten und Texte.</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          + Neue Seite
        </button>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['Seitenname', 'URL', 'Status', 'Zuletzt bearbeitet', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4 text-white font-medium">{page.title}</td>
                <td className="p-4 text-slate-400 text-xs font-mono">{page.slug}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    page.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {page.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-xs">{page.updatedAt}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(editingId === page.id ? null : page.id)}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button className="text-xs text-slate-400 hover:text-white transition-colors">Vorschau</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="bg-[#13131a] border border-violet-500/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Seite bearbeiten: {pages.find(p => p.id === editingId)?.title}
          </h2>
          <textarea
            rows={8}
            defaultValue={`# ${pages.find(p => p.id === editingId)?.title}\n\nInhalt hier bearbeiten...`}
            className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono resize-vertical"
          />
          <div className="flex gap-3 mt-4">
            <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-all">
              Speichern
            </button>
            <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white text-sm transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
