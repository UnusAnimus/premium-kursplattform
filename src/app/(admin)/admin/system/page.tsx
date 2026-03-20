'use client';
import { useState } from 'react';

export default function AdminSystemPage() {
  const [settings, setSettings] = useState({
    siteName: 'Arkanum Akademie',
    siteUrl: 'https://arkanum-akademie.de',
    supportEmail: 'support@arkanum-akademie.de',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Systemeinstellungen</h1>
        <p className="text-[var(--text-secondary)]">Allgemeine Konfiguration der Plattform.</p>
      </div>

      {/* General */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Allgemein</h2>
        <div className="space-y-4">
          {[
            { key: 'siteName', label: 'Plattformname', type: 'text' },
            { key: 'siteUrl', label: 'URL', type: 'url' },
            { key: 'supportEmail', label: 'Support-E-Mail', type: 'email' },
          ].map(field => (
            <div key={field.key}>
              <label className="text-[var(--text-secondary)] text-sm font-medium block mb-2">{field.label}</label>
              <input
                type={field.type}
                value={settings[field.key as keyof typeof settings] as string}
                onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full bg-[var(--input-bg)] border border-[var(--border-base)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Access */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Zugriff & Registrierung</h2>
        <div className="space-y-4">
          {[
            { key: 'maintenanceMode', label: 'Wartungsmodus', desc: 'Plattform für Nutzer gesperrt' },
            { key: 'registrationEnabled', label: 'Registrierung aktiviert', desc: 'Neue Nutzer können sich registrieren' },
            { key: 'emailVerification', label: 'E-Mail-Verifizierung', desc: 'Pflichtverifizierung nach Registrierung' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[var(--bg-surface-raised)] rounded-xl border border-[var(--border-base)]">
              <div>
                <p className="text-[var(--text-primary)] text-sm">{item.label}</p>
                <p className="text-[var(--text-muted)] text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`w-12 h-6 rounded-full transition-all relative ${settings[item.key as keyof typeof settings] ? 'bg-violet-600' : 'bg-[var(--border-strong)]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key as keyof typeof settings] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all">
          Einstellungen speichern
        </button>
        <button className="border border-red-500/50 text-red-400 hover:bg-red-500/10 px-6 py-2.5 rounded-lg text-sm transition-all">
          Cache leeren
        </button>
      </div>
    </div>
  );
}
