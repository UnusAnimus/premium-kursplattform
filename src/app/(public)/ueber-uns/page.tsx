export default function UeberUnsPage() {
  const team = [
    { name: 'Dr. Elena Mystika', role: 'Gründerin & Leiterin', bio: 'Visionärin und Expertin für Bewusstseinswissenschaft mit 20 Jahren Erfahrung.', icon: '∞' },
    { name: 'Prof. Karl Richter', role: 'Wissenschaftsleiter', bio: 'Brücke zwischen moderner Physik und spiritueller Weisheit.', icon: '✦' },
    { name: 'Marina Sternenkind', role: 'Astrologie-Leiterin', bio: 'Professionelle Astrologin und Bestseller-Autorin.', icon: '☽' },
    { name: 'Magnus Hermes', role: 'Philosophie-Leiter', bio: 'Doktor der Religionswissenschaften und Hermetiker.', icon: '⚗' },
  ];

  const values = [
    { icon: '◈', title: 'Authentizität', desc: 'Wir lehren nur Inhalte, die wir selbst praktizieren und für wahr befunden haben.' },
    { icon: '✦', title: 'Transformation', desc: 'Unser Ziel ist echte Veränderung – nicht nur theoretisches Wissen.' },
    { icon: '⬡', title: 'Gemeinschaft', desc: 'Gemeinsam wachsen wir schneller. Unsere Community ist der Herzschlag der Akademie.' },
    { icon: '◆', title: 'Qualität', desc: 'Jeder Kurs wird sorgfältig kuratiert und auf höchstem Niveau produziert.' },
  ];

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Hero */}
      <div className="border-b border-[#1e1e2e] bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="text-6xl mb-6">⬡</div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Über die{' '}
            <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">
              Arkanum Akademie
            </span>
          </h1>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Wir sind eine Premium-Lernplattform, die sich der Verbindung von uralter Weisheit und modernem Wissen widmet. Unsere Mission ist es, spirituelle Bildung zugänglich und transformativ zu machen.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
                <span className="text-violet-400">✦</span>
                <span className="text-violet-300 text-sm">Unsere Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Wissen, das wirklich transformiert</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Die Arkanum Akademie wurde 2020 mit einer klaren Vision gegründet: Spirituelles und metaphysisches Wissen auf dem höchsten Qualitätsniveau zugänglich zu machen – ohne esoterischen Firlefanz, aber mit echter Tiefe.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Unsere Lehrer sind echte Praktiker mit jahrzehntelanger Erfahrung. Unsere Kurse verbinden Wissenschaft und Spiritualität, Theorie und Praxis, Tradition und Innovation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '6.000+', label: 'Studierende' },
                { value: '6', label: 'Premium Kurse' },
                { value: '4 Jahre', label: 'Erfahrung' },
                { value: '98%', label: 'Zufriedenheit' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 text-center hover:border-violet-500/50 transition-all">
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#13131a]/30 border-y border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Unsere Werte</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Das sind die Prinzipien, die uns täglich leiten.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 hover:border-violet-500/50 transition-all text-center">
                <div className="text-3xl text-violet-400 mb-4">{value.icon}</div>
                <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-400 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Unser Team</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Die Meister hinter der Akademie.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 text-center hover:border-violet-500/50 transition-all">
                <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
                  {member.icon}
                </div>
                <h3 className="text-white font-semibold mb-1">{member.name}</h3>
                <p className="text-violet-400 text-xs mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
