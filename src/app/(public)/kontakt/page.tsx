'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
        }),
      });

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        setError(json.error ?? 'Ein Fehler ist aufgetreten.');
        return;
      }

      setSent(true);
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-base)] min-h-screen">
      <div className="border-b border-[var(--border-base)] text-center py-24">
        <h1 className="text-5xl font-bold text-white mb-4">
          <span className="text-[var(--text-primary)]">
          Kontakt{' '}
          </span>
          <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">aufnehmen</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Hast du Fragen? Wir sind für dich da. Schreib uns und wir melden uns innerhalb von 24 Stunden.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">So erreichst du uns</h2>
            <div className="space-y-6">
              {[
                { icon: '◎', title: 'E-Mail', desc: 'kontakt@arkanum-akademie.de', sub: 'Antwort innerhalb 24 Stunden' },
                { icon: '⬡', title: 'Community', desc: 'Tritt unserer Discord-Community bei', sub: 'Sofortige Antworten von der Community' },
                { icon: '✦', title: 'Live-Support', desc: 'Wöchentliche Live-Sessions', sub: 'Jeden Dienstag um 19:00 Uhr' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 brand-chip rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[var(--text-primary)] font-semibold">{item.title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
                    <p className="text-[var(--text-muted)] text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="status-success rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">✦</div>
                <h3 className="text-2xl font-bold mb-2">Nachricht gesendet!</h3>
                <p>Wir melden uns innerhalb von 24 Stunden bei dir.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-8 space-y-6 shadow-[var(--shadow-sm)]">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">Schreib uns</h2>
                {error && (
                  <p className="status-error text-sm rounded-lg px-4 py-2">{error}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Vorname" name="firstName" placeholder="Max" required />
                  <Input label="Nachname" name="lastName" placeholder="Mustermann" required />
                </div>
                <Input label="E-Mail" name="email" type="email" placeholder="max@example.com" required />
                <Input label="Betreff" name="subject" placeholder="Frage zu einem Kurs" required />
                <Textarea label="Nachricht" name="message" placeholder="Schreib uns deine Frage oder Anmerkung..." rows={5} required />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30"
                >
                  {loading ? 'Wird gesendet…' : 'Nachricht senden ✦'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
