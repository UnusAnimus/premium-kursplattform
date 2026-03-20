import { mockPayments } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  paid: 'status-success',
  pending: 'status-warning',
  failed: 'status-error',
  refunded: 'status-neutral',
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
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Zahlungen</h1>
        <p className="text-[var(--text-secondary)]">Zahlungs- und Aboverwaltung</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Gesamtumsatz (Demo)', value: formatPrice(total), color: 'text-[var(--text-primary)]' },
          { label: 'Bezahlte Transaktionen', value: mockPayments.filter(p => p.status === 'paid').length.toString(), color: 'text-emerald-400' },
          { label: 'Ausstehend', value: mockPayments.filter(p => p.status === 'pending').length.toString(), color: 'text-amber-400' },
        ].map((item, i) => (
          <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-5">
            <div className={`text-2xl font-bold mb-1 ${item.color}`}>{item.value}</div>
            <div className="text-[var(--text-secondary)] text-xs">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border-base)] bg-[var(--bg-surface-raised)]">
            <tr>
              {['ID', 'Nutzer', 'Plan', 'Betrag', 'Status', 'Methode', 'Datum'].map(h => (
                <th key={h} className="text-left text-[var(--text-secondary)] font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-base)]">
            {mockPayments.map(payment => (
              <tr key={payment.id} className="hover:bg-[var(--row-hover)] transition-colors">
                <td className="p-4 text-[var(--text-muted)] text-xs">{payment.id}</td>
                <td className="p-4 text-[var(--text-primary)]">{payment.userName}</td>
                <td className="p-4">
                  <span className="text-xs brand-chip px-2.5 py-1 rounded-full">
                    {planLabels[payment.plan]}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-primary)] font-medium">{formatPrice(payment.amount)}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[payment.status]}`}>
                    {statusLabels[payment.status]}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-secondary)]">{payment.method}</td>
                <td className="p-4 text-[var(--text-secondary)] text-xs">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
