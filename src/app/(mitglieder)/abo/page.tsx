import { pricingPlans } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AboPage() {
  const currentPlan = pricingPlans[1]; // Premium

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Abo verwalten</h1>
        <p className="text-slate-400">Verwalte dein Abonnement und deine Zahlungen.</p>
      </div>

      {/* Current plan */}
      <div className="bg-violet-900/20 border border-violet-500/50 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 text-xs px-3 py-1.5 rounded-full mb-2">
              ✦ Aktueller Plan
            </div>
            <h2 className="text-2xl font-bold text-white">{currentPlan.name}</h2>
            <p className="text-slate-400 text-sm mt-1">Verlängert am 10. Juli 2025</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{formatPrice(currentPlan.price)}</div>
            <div className="text-slate-400 text-sm">/Monat</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Status', value: 'Aktiv', color: 'text-emerald-400' },
            { label: 'Beginn', value: '10.02.2024', color: 'text-white' },
            { label: 'Verlängerung', value: '10.07.2025', color: 'text-white' },
            { label: 'Zahlungsmethode', value: 'PayPal', color: 'text-white' },
          ].map((item, i) => (
            <div key={i} className="bg-black/20 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">{item.label}</p>
              <p className={`font-semibold text-sm ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="border border-violet-500 text-violet-300 hover:bg-violet-500/10 px-5 py-2 rounded-lg text-sm font-medium transition-all">
            Zahlungsmethode ändern
          </button>
          <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
            Abo kündigen
          </button>
        </div>
      </div>

      {/* Upgrade options */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Plan upgraden</h2>
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Masterclass</h3>
              <p className="text-slate-400 text-sm">Das ultimative Erlebnis für Meister und spirituelle Lehrer</p>
              <ul className="mt-3 space-y-1">
                {['1:1 Coaching-Sessions', 'Lehrer-Zertifizierung', 'Eigene Kurse erstellen'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-violet-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-right ml-6">
              <div className="text-2xl font-bold text-white">99 €</div>
              <div className="text-slate-400 text-xs">/Monat</div>
              <Link href="/preise" className="mt-3 block bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all">
                Upgraden
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Billing history */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Zahlungshistorie</h2>
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#1e1e2e]">
              <tr>
                <th className="text-left text-slate-400 font-medium p-4">Datum</th>
                <th className="text-left text-slate-400 font-medium p-4">Beschreibung</th>
                <th className="text-left text-slate-400 font-medium p-4">Betrag</th>
                <th className="text-left text-slate-400 font-medium p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {[
                { date: '10.06.2024', desc: 'Premium Plan', amount: '49,00 €', status: 'Bezahlt' },
                { date: '10.05.2024', desc: 'Premium Plan', amount: '49,00 €', status: 'Bezahlt' },
                { date: '10.04.2024', desc: 'Premium Plan', amount: '49,00 €', status: 'Bezahlt' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/2 transition-colors">
                  <td className="p-4 text-slate-300">{row.date}</td>
                  <td className="p-4 text-slate-300">{row.desc}</td>
                  <td className="p-4 text-white font-medium">{row.amount}</td>
                  <td className="p-4"><span role="status" aria-label={`Zahlungsstatus: ${row.status}`} className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs">{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
