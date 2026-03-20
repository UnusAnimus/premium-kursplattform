'use client';
import { useState, useEffect, useCallback } from 'react';
import { KI_ALLOWED_MODELS, KI_SYSTEM_PROMPT_MAX_LENGTH } from '@/lib/kiConstants';

interface KiSettingsState {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabled: boolean;
  knowledgeBase: boolean;
}

const DEFAULT_SETTINGS: KiSettingsState = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt:
    'Du bist ein hilfreicher KI-Assistent für die Arkanum Akademie. Du beantwortest Fragen über Metaphysik, Astrologie, Hermetik, Schamanismus und andere spirituelle Themen. Beziehe dich dabei auf die Kursinhalte der Akademie. Antworte immer auf Deutsch.',
  enabled: true,
  knowledgeBase: true,
};

export default function AdminKiPage() {
  const [settings, setSettings] = useState<KiSettingsState>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/ki/settings');
      if (res.ok) {
        const data = await res.json() as { settings: KiSettingsState };
        setSettings({
          model: data.settings.model,
          temperature: data.settings.temperature,
          maxTokens: data.settings.maxTokens,
          systemPrompt: data.settings.systemPrompt,
          enabled: data.settings.enabled,
          knowledgeBase: data.settings.knowledgeBase,
        });
      }
    } catch {
      // keep defaults on network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/ki/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveMessage({ type: 'success', text: 'Einstellungen erfolgreich gespeichert.' });
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setSaveMessage({ type: 'error', text: data.error ?? 'Speichern fehlgeschlagen.' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'Netzwerkfehler beim Speichern.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">KI-Einstellungen</h1>
          <p className="text-[var(--text-secondary)]">Konfiguriere den KI-Assistenten.</p>
        </div>
        <div className="text-[var(--text-secondary)] text-sm">Lade Einstellungen…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">KI-Einstellungen</h1>
        <p className="text-[var(--text-secondary)]">Konfiguriere den KI-Assistenten.</p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Grundkonfiguration</h2>
        <div className="space-y-4">
          {/* Model */}
          <div>
            <label className="text-[var(--text-secondary)] text-sm font-medium block mb-2">KI-Modell</label>
            <select
              value={settings.model}
              onChange={e => setSettings(prev => ({ ...prev, model: e.target.value }))}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-base)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {KI_ALLOWED_MODELS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-[var(--text-secondary)] text-sm font-medium block mb-2">
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
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>Präzise</span>
              <span>Kreativ</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="text-[var(--text-secondary)] text-sm font-medium block mb-2">
              Max. Token: {settings.maxTokens}
            </label>
            <input
              type="range"
              min="256"
              max="4096"
              step="256"
              value={settings.maxTokens}
              onChange={e => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
              <span>256</span>
              <span>4096</span>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="text-[var(--text-secondary)] text-sm font-medium block mb-2">System-Prompt</label>
            <textarea
              value={settings.systemPrompt}
              onChange={e => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
              rows={5}
              maxLength={KI_SYSTEM_PROMPT_MAX_LENGTH}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-base)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-violet-500 resize-vertical"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">{settings.systemPrompt.length}/{KI_SYSTEM_PROMPT_MAX_LENGTH}</p>
          </div>

          {/* Toggles */}
          {([
            { key: 'enabled' as const, label: 'KI-Assistent aktiviert', desc: 'Mitglieder können den Assistenten nutzen' },
            { key: 'knowledgeBase' as const, label: 'Kurswissen einbeziehen', desc: 'Antworten basieren auf Kursinhalten' },
          ]).map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 surface-subtle rounded-xl">
              <div>
                <p className="text-[var(--text-primary)] text-sm">{item.label}</p>
                <p className="text-[var(--text-muted)] text-xs">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`w-12 h-6 rounded-full transition-all relative ${settings[item.key] ? 'bg-violet-600' : 'bg-[var(--border-strong)]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {saveMessage && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            saveMessage.type === 'success'
              ? 'status-success'
              : 'status-error'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <button
        onClick={saveSettings}
        disabled={isSaving}
        className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-all"
      >
        {isSaving ? 'Speichern…' : 'Einstellungen speichern'}
      </button>
    </div>
  );
}
