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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Seitenverwaltung</h1>
          <p className="text-[var(--text-secondary)]">Verwalte statische Seiten und Texte.</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          + Neue Seite
        </button>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border-base)] bg-[var(--bg-surface-raised)]">
            <tr>
              {['Seitenname', 'URL', 'Status', 'Zuletzt bearbeitet', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-[var(--text-secondary)] font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-base)]">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-[var(--row-hover)] transition-colors">
                <td className="p-4 text-[var(--text-primary)] font-medium">{page.title}</td>
                <td className="p-4 text-[var(--text-secondary)] text-xs font-mono">{page.slug}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    page.status === 'published'
                      ? 'status-success'
                      : 'status-warning'
                  }`}>
                    {page.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-secondary)] text-xs">{page.updatedAt}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(editingId === page.id ? null : page.id)}
                      className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Vorschau</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="bg-[var(--bg-surface)] border border-[var(--badge-brand-border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Seite bearbeiten: {pages.find(p => p.id === editingId)?.title}
          </h2>
          <textarea
            rows={8}
            defaultValue={`# ${pages.find(p => p.id === editingId)?.title}\n\nInhalt hier bearbeiten...`}
            className="w-full bg-[var(--input-bg)] border border-[var(--border-base)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono resize-vertical"
          />
          <div className="flex gap-3 mt-4">
            <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-all">
              Speichern
            </button>
            <button onClick={() => setEditingId(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
