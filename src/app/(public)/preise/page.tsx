import { pricingPlans } from '@/lib/data';
import { PricingCard } from '@/components/sections/PricingCard';

const faq = [
  { q: 'Gibt es eine Geld-zurück-Garantie?', a: 'Ja! Du erhältst innerhalb von 30 Tagen dein Geld zurück, keine Fragen gestellt.' },
  { q: 'Kann ich meinen Plan jederzeit kündigen?', a: 'Ja, du kannst jederzeit kündigen. Du behältst Zugang bis zum Ende deiner Abrechnungsperiode.' },
  { q: 'Gibt es einen Unterschied zwischen monatlicher und jährlicher Zahlung?', a: 'Mit jährlicher Zahlung sparst du bis zu 30%. Kontaktiere uns für Details.' },
  { q: 'Sind alle Kurse in jedem Plan verfügbar?', a: 'Im Premium- und Masterclass-Plan hast du Zugang zu allen Kursen. Im Basis-Plan kannst du 3 Kurse frei wählen.' },
  { q: 'Wie funktioniert der KI-Assistent?', a: 'Unser KI-Assistent basiert auf modernster KI-Technologie und ist speziell auf unsere Kursinhalte trainiert.' },
  { q: 'Bekomme ich Zertifikate?', a: 'Ja, in Premium und Masterclass erhältst du offizielle Zertifikate nach Kursabschluss.' },
];

export default function PreisePage() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Header */}
      <div className="border-b border-[#1e1e2e] text-center py-24">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
          <span className="text-violet-400">◆</span>
          <span className="text-violet-300 text-sm">Transparente Preise</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Wähle deinen{' '}
          <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
            Lernpfad
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Flexible Mitgliedschaftsoptionen für jeden Lernenden – von Einsteiger bis Meister.
        </p>
      </div>

      {/* Plans */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map(plan => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#13131a]/30 border-t border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Häufige Fragen</h2>
            <p className="text-slate-400">Alles was du wissen musst, bevor du startest.</p>
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 hover:border-violet-500/30 transition-all">
                <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
