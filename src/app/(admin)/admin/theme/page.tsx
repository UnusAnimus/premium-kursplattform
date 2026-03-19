'use client';
import { useState } from 'react';

export default function AdminThemePage() {
  const [colors, setColors] = useState({
    primary: '#7c3aed',
    accent: '#f59e0b',
    bgDark: '#0a0a0f',
    bgCard: '#13131a',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const colorFields = [
    { key: 'primary', label: 'Primärfarbe (Violet)' },
    { key: 'accent', label: 'Akzentfarbe (Amber)' },
    { key: 'bgDark', label: 'Hintergrundfarbe' },
    { key: 'bgCard', label: 'Kartenfarbe' },
    { key: 'textPrimary', label: 'Primärtext' },
    { key: 'textSecondary', label: 'Sekundärtext' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Theme Editor</h1>
        <p className="text-slate-400">Passe das visuelle Erscheinungsbild der Akademie an.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color settings */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Farbpalette</h2>
          <div className="space-y-4">
            {colorFields.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <label className="text-slate-300 text-sm flex-1">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[key as keyof typeof colors]}
                    onChange={e => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-[#2a2a3e] bg-transparent cursor-pointer"
                  />
                  <span className="text-slate-500 text-xs font-mono w-20">{colors[key as keyof typeof colors]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Vorschau</h2>
          <div
            className="rounded-xl p-6 border"
            style={{ backgroundColor: colors.bgCard, borderColor: '#1e1e2e' }}
          >
            <h3 style={{ color: colors.textPrimary }} className="font-bold text-lg mb-2">
              Beispiel-Karte
            </h3>
            <p style={{ color: colors.textSecondary }} className="text-sm mb-4">
              So sehen deine Karten mit den gewählten Farben aus.
            </p>
            <button
              style={{ backgroundColor: colors.primary }}
              className="text-white text-sm font-semibold px-4 py-2 rounded-lg mr-2"
            >
              Primärbutton
            </button>
            <button
              style={{ backgroundColor: colors.accent }}
              className="text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Akzentbutton
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
        >
          {saved ? '✓ Gespeichert!' : 'Theme speichern'}
        </button>
        <button
          onClick={() => setColors({ primary: '#7c3aed', accent: '#f59e0b', bgDark: '#0a0a0f', bgCard: '#13131a', textPrimary: '#f8fafc', textSecondary: '#94a3b8' })}
          className="border border-[#1e1e2e] hover:border-violet-500 text-slate-400 hover:text-white px-6 py-2.5 rounded-lg text-sm transition-all"
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
