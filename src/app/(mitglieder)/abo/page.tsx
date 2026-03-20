import { pricingPlans } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AboPage() {
  const currentPlan = pricingPlans[1]; // Premium

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Abo verwalten</h1>
        <p className="text-[var(--text-secondary)]">Verwalte dein Abonnement und deine Zahlungen.</p>
      </div>

      {/* Current plan */}
      <div className="bg-[var(--bg-surface-raised)] border border-[var(--badge-brand-border)] rounded-2xl p-8 shadow-[var(--shadow-sm)]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 brand-chip text-xs px-3 py-1.5 rounded-full mb-2">
              ✦ Aktueller Plan
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{currentPlan.name}</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Verlängert am 10. Juli 2025</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{formatPrice(currentPlan.price)}</div>
            <div className="text-[var(--text-secondary)] text-sm">/Monat</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Status', value: 'Aktiv', color: 'text-emerald-400' },
            { label: 'Beginn', value: '10.02.2024', color: 'text-white' },
            { label: 'Verlängerung', value: '10.07.2025', color: 'text-white' },
            { label: 'Zahlungsmethode', value: 'PayPal', color: 'text-white' },
          ].map((item, i) => (
            <div key={i} className="surface-subtle rounded-xl p-4">
              <p className="text-[var(--text-secondary)] text-xs mb-1">{item.label}</p>
              <p className={`font-semibold text-sm ${item.color === 'text-emerald-400' ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/kontakt"
            className="border border-[var(--badge-brand-border)] text-[var(--badge-brand-text)] hover:bg-[var(--badge-brand-bg)] px-5 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Zahlungsmethode ändern
          </Link>
          <Link
            href="/kontakt"
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center"
          >
            Abo kündigen
          </Link>
        </div>
        <p className="text-[var(--text-muted)] text-xs mt-3">Für Änderungen am Abo kontaktiere uns bitte direkt.</p>
      </div>

      {/* Upgrade options */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Plan upgraden</h2>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[var(--text-primary)] font-semibold">Masterclass</h3>
              <p className="text-[var(--text-secondary)] text-sm">Das ultimative Erlebnis für Meister und spirituelle Lehrer</p>
              <ul className="mt-3 space-y-1">
                {['1:1 Coaching-Sessions', 'Lehrer-Zertifizierung', 'Eigene Kurse erstellen'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--badge-brand-text)]">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right ml-6">
              <div className="text-2xl font-bold text-[var(--text-primary)]">99 €</div>
              <div className="text-[var(--text-secondary)] text-xs">/Monat</div>
              <Link href="/preise" className="mt-3 block bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all">
                Upgraden
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Billing history */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Zahlungshistorie</h2>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-base)] bg-[var(--bg-surface-raised)]">
              <tr>
                <th className="text-left text-[var(--text-secondary)] font-medium p-4">Datum</th>
                <th className="text-left text-[var(--text-secondary)] font-medium p-4">Beschreibung</th>
                <th className="text-left text-[var(--text-secondary)] font-medium p-4">Betrag</th>
                <th className="text-left text-[var(--text-secondary)] font-medium p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-base)]">
              {[
                { date: '10.06.2024', desc: 'Premium Plan', amount: '49,00 €', status: 'Bezahlt' },
                { date: '10.05.2024', desc: 'Premium Plan', amount: '49,00 €', status: 'Bezahlt' },
                { date: '10.04.2024', desc: 'Premium Plan', amount: '49,00 €', status: 'Bezahlt' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[var(--row-hover)] transition-colors">
                  <td className="p-4 text-[var(--text-secondary)]">{row.date}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{row.desc}</td>
                  <td className="p-4 text-[var(--text-primary)] font-medium">{row.amount}</td>
                  <td className="p-4"><span role="status" aria-label={`Zahlungsstatus: ${row.status}`} className="status-success px-2.5 py-1 rounded-full text-xs">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
