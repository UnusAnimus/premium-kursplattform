const stats = [
  { value: '6.000+', label: 'Aktive Studierende', icon: '◎' },
  { value: '6', label: 'Premium Kurse', icon: '◈' },
  { value: '4,9', label: 'Durchschnittsbewertung', icon: '★' },
  { value: '98%', label: 'Zufriedenheitsrate', icon: '✦' },
];

export function Stats() {
  return (
    <section className="py-20 border-y border-[#1e1e2e] bg-[#13131a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl text-violet-400 mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
