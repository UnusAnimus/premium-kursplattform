'use client';
import { useState } from 'react';

export default function AdminKiPage() {
  const [settings, setSettings] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: 'Du bist ein hilfreicher KI-Assistent für die Arkanum Akademie. Du beantwortest Fragen über Metaphysik, Astrologie, Hermetik, Schamanismus und andere spirituelle Themen. Beziehe dich dabei auf die Kursinhalte der Akademie.',
    enabled: true,
    knowledgeBase: true,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">KI-Einstellungen</h1>
        <p className="text-slate-400">Konfiguriere den KI-Assistenten.</p>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Grundkonfiguration</h2>
        <div className="space-y-4">
          {/* Model */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">KI-Modell</label>
            <select
              value={settings.model}
              onChange={e => setSettings(prev => ({ ...prev, model: e.target.value }))}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3">Claude 3</option>
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Kreativität (Temperatur): {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={e => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Präzise</span>
              <span>Kreativ</span>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">System-Prompt</label>
            <textarea
              value={settings.systemPrompt}
              onChange={e => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
              rows={5}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-vertical"
            />
          </div>

          {/* Toggles */}
          {[
            { key: 'enabled', label: 'KI-Assistent aktiviert', desc: 'Mitglieder können den Assistenten nutzen' },
            { key: 'knowledgeBase', label: 'Kurswissen einbeziehen', desc: 'Antworten basieren auf Kursinhalten' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-xl">
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

      <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all">
        Einstellungen speichern
      </button>
    </div>
  );
}
