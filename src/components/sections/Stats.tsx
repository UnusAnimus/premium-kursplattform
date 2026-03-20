interface StatsProps {
  courseCount: number;
  averageRating: number;
}

export function Stats({ courseCount, averageRating }: StatsProps) {
  const stats = [
    { value: '6.000+', label: 'Aktive Studierende', icon: '◎' },
    { value: String(courseCount), label: 'Premium Kurse', icon: '◈' },
    { value: averageRating.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), label: 'Durchschnittsbewertung', icon: '★' },
    { value: '98%', label: 'Zufriedenheitsrate', icon: '✦' },
  ];

  return (
    <section className="py-20 border-y border-[var(--border-base)] bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl text-violet-400 mb-3">{stat.icon}</div>
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-[var(--text-secondary)] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

