'use client';
import { useState } from 'react';

export default function AdminDesignPage() {
  const [settings, setSettings] = useState({
    heroStyle: 'particles',
    fontFamily: 'inter',
    borderRadius: 'xl',
    animationsEnabled: true,
    glowEffects: true,
    glassmorphism: true,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Design-Einstellungen</h1>
        <p className="text-slate-400">Gestalte das visuelle Erscheinungsbild der Plattform.</p>
      </div>

      <div className="space-y-6">
        {/* Hero Style */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Hero-Hintergrund</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'particles', label: 'Partikel' },
              { value: 'geometric', label: 'Geometrisch' },
              { value: 'gradient', label: 'Verlauf' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSettings(prev => ({ ...prev, heroStyle: option.value }))}
                className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                  settings.heroStyle === option.value
                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                    : 'bg-[#0a0a0f] border-[#1e1e2e] text-slate-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Schriftart</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'inter', label: 'Inter' },
              { value: 'geist', label: 'Geist' },
              { value: 'system', label: 'System' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSettings(prev => ({ ...prev, fontFamily: option.value }))}
                className={`p-4 rounded-xl border text-sm font-medium transition-all ${
                  settings.fontFamily === option.value
                    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                    : 'bg-[#0a0a0f] border-[#1e1e2e] text-slate-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle settings */}
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Effekte</h2>
          <div className="space-y-4">
            {[
              { key: 'animationsEnabled', label: 'Animationen aktiviert', desc: 'Float- und Pulsieranimationen' },
              { key: 'glowEffects', label: 'Glow-Effekte', desc: 'Leuchtende Schatten auf Hover' },
              { key: 'glassmorphism', label: 'Glassmorphismus', desc: 'Frosted-Glass-Effekte' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{item.label}</p>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings[item.key as keyof typeof settings] ? 'bg-violet-600' : 'bg-[#2a2a3e]'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key as keyof typeof settings] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all">
        Einstellungen speichern
      </button>
    </div>
  );
}
