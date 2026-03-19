'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function KontaktPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      <div className="border-b border-[#1e1e2e] text-center py-24">
        <h1 className="text-5xl font-bold text-white mb-4">
          Kontakt{' '}
          <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">aufnehmen</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Hast du Fragen? Wir sind für dich da. Schreib uns und wir melden uns innerhalb von 24 Stunden.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">So erreichst du uns</h2>
            <div className="space-y-6">
              {[
                { icon: '◎', title: 'E-Mail', desc: 'kontakt@arkanum-akademie.de', sub: 'Antwort innerhalb 24 Stunden' },
                { icon: '⬡', title: 'Community', desc: 'Tritt unserer Discord-Community bei', sub: 'Sofortige Antworten von der Community' },
                { icon: '✦', title: 'Live-Support', desc: 'Wöchentliche Live-Sessions', sub: 'Jeden Dienstag um 19:00 Uhr' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-2xl text-violet-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-slate-300 text-sm">{item.desc}</p>
                    <p className="text-slate-500 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="bg-[#13131a] border border-emerald-500/30 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">✦</div>
                <h3 className="text-white text-2xl font-bold mb-2">Nachricht gesendet!</h3>
                <p className="text-slate-400">Wir melden uns innerhalb von 24 Stunden bei dir.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-white">Schreib uns</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Vorname" placeholder="Max" required />
                  <Input label="Nachname" placeholder="Mustermann" required />
                </div>
                <Input label="E-Mail" type="email" placeholder="max@example.com" required />
                <Input label="Betreff" placeholder="Frage zu einem Kurs" required />
                <Textarea label="Nachricht" placeholder="Schreib uns deine Frage oder Anmerkung..." rows={5} required />
                <button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/30"
                >
                  Nachricht senden ✦
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
