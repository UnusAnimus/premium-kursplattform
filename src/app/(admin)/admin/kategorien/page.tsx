import { categories, courses } from '@/lib/data';

export default function AdminKategorienPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Kategorien</h1>
          <p className="text-[var(--text-secondary)]">{categories.length} Kategorien</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          + Neue Kategorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const catCourses = courses.filter(c => c.category === cat.name);
          return (
            <div key={cat.id} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-5 hover:bg-[var(--bg-surface-hover)] hover:border-violet-500/40 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 brand-chip rounded-xl flex items-center justify-center text-xl">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-[var(--text-primary)] font-semibold">{cat.name}</h3>
                    <p className="text-[var(--text-muted)] text-xs">{catCourses.length} Kurse</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Bearbeiten</button>
                  <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Löschen</button>
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-sm">{cat.description}</p>
              <div className="mt-3 pt-3 border-t border-[var(--border-base)] flex flex-wrap gap-1">
                {catCourses.map(c => (
                  <span key={c.id} className="text-xs surface-subtle text-[var(--text-secondary)] px-2 py-0.5 rounded">
                    {c.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
