const features = [
  { icon: '◈', title: 'Expertenwissen', desc: 'Lerne von zertifizierten Lehrern mit jahrzehntelanger Erfahrung in ihren Fachgebieten.' },
  { icon: '◆', title: 'Zertifizierte Kurse', desc: 'Erhalte anerkannte Zertifikate nach erfolgreichem Abschluss deiner Kurse.' },
  { icon: '✦', title: 'KI-Lernassistent', desc: 'Unser KI-Assistent beantwortet deine Fragen und hilft dir bei der Vertiefung des Lernstoffs.' },
  { icon: '⬡', title: 'Community-Zugang', desc: 'Verbinde dich mit Gleichgesinnten in unserer aktiven und unterstützenden Gemeinschaft.' },
  { icon: '∞', title: 'Lebenslanger Zugriff', desc: 'Einmal kaufen, für immer lernen. Alle Kursinhalte bleiben dir dauerhaft zugänglich.' },
  { icon: '◎', title: 'Flexible Lernzeiten', desc: 'Lerne in deinem eigenen Tempo, wann und wo es für dich am besten passt.' },
];

export function Features() {
  return (
    <section className="py-24 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-violet-400 text-sm">✦</span>
            <span className="text-violet-300 text-sm font-medium">Warum Arkanum Akademie?</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Alles was du für deine{' '}
            <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
              spirituelle Reise
            </span>{' '}
            brauchst
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Wir bieten dir die beste Lernumgebung für deine persönliche und spirituelle Entwicklung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-2xl text-violet-400 mb-5 group-hover:bg-violet-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
