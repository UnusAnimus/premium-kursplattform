import { mockPayments } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-400',
  failed: 'bg-red-500/10 text-red-400',
  refunded: 'bg-slate-500/10 text-slate-400',
};

const statusLabels: Record<string, string> = {
  paid: 'Bezahlt',
  pending: 'Ausstehend',
  failed: 'Fehlgeschlagen',
  refunded: 'Zurückerstattet',
};

const planLabels: Record<string, string> = {
  basis: 'Basis',
  premium: 'Premium',
  masterclass: 'Masterclass',
};

export default function AdminZahlungenPage() {
  const total = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Zahlungen</h1>
        <p className="text-slate-400">Zahlungs- und Aboverwaltung</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Gesamtumsatz (Demo)', value: formatPrice(total), color: 'text-white' },
          { label: 'Bezahlte Transaktionen', value: mockPayments.filter(p => p.status === 'paid').length.toString(), color: 'text-emerald-400' },
          { label: 'Ausstehend', value: mockPayments.filter(p => p.status === 'pending').length.toString(), color: 'text-amber-400' },
        ].map((item, i) => (
          <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5">
            <div className={`text-2xl font-bold mb-1 ${item.color}`}>{item.value}</div>
            <div className="text-slate-400 text-xs">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['ID', 'Nutzer', 'Plan', 'Betrag', 'Status', 'Methode', 'Datum'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {mockPayments.map(payment => (
              <tr key={payment.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4 text-slate-500 text-xs">{payment.id}</td>
                <td className="p-4 text-white">{payment.userName}</td>
                <td className="p-4">
                  <span className="text-xs bg-violet-500/10 text-violet-300 px-2.5 py-1 rounded-full">
                    {planLabels[payment.plan]}
                  </span>
                </td>
                <td className="p-4 text-white font-medium">{formatPrice(payment.amount)}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[payment.status]}`}>
                    {statusLabels[payment.status]}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{payment.method}</td>
                <td className="p-4 text-slate-400 text-xs">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
