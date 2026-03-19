'use client';
import { useState } from 'react';

export default function EinstellungenPage() {
  const [notifications, setNotifications] = useState({ email: true, newsletter: false, updates: true });
  const [privacy, setPrivacy] = useState({ publicProfile: true, showProgress: false });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Einstellungen</h1>
        <p className="text-slate-400">Verwalte deine Kontoeinstellungen.</p>
      </div>

      {/* Notifications */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Benachrichtigungen</h2>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'E-Mail Benachrichtigungen', desc: 'Erhalte Updates zu deinen Kursen' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Wöchentliche spirituelle Impulse' },
            { key: 'updates', label: 'Kurs-Updates', desc: 'Wenn neue Lektionen verfügbar sind' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-xl">
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`w-12 h-6 rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'bg-violet-600' : 'bg-[#2a2a3e]'} relative`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Datenschutz</h2>
        <div className="space-y-4">
          {[
            { key: 'publicProfile', label: 'Öffentliches Profil', desc: 'Andere können dein Profil sehen' },
            { key: 'showProgress', label: 'Fortschritt teilen', desc: 'Community sieht deinen Lernfortschritt' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-xl">
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                className={`w-12 h-6 rounded-full transition-all ${privacy[item.key as keyof typeof privacy] ? 'bg-violet-600' : 'bg-[#2a2a3e]'} relative`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacy[item.key as keyof typeof privacy] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Sicherheit</h2>
        <div className="space-y-3">
          <button className="w-full text-left p-4 bg-[#0a0a0f] rounded-xl hover:bg-[#1a1a24] transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Passwort ändern</p>
                <p className="text-slate-500 text-xs">Zuletzt geändert vor 3 Monaten</p>
              </div>
              <span className="text-slate-500 group-hover:text-violet-400 transition-colors">→</span>
            </div>
          </button>
          <button className="w-full text-left p-4 bg-[#0a0a0f] rounded-xl hover:bg-[#1a1a24] transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Zwei-Faktor-Authentifizierung</p>
                <p className="text-slate-500 text-xs">Empfohlen für mehr Sicherheit</p>
              </div>
              <span className="text-slate-500 group-hover:text-violet-400 transition-colors">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
