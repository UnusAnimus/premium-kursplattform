import { categories, courses } from '@/lib/data';

export default function AdminKategorienPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Kategorien</h1>
          <p className="text-slate-400">{categories.length} Kategorien</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          + Neue Kategorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const catCourses = courses.filter(c => c.category === cat.name);
          return (
            <div key={cat.id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5 hover:border-violet-500/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-xl text-violet-400">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{cat.name}</h3>
                    <p className="text-slate-500 text-xs">{catCourses.length} Kurse</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-slate-400 hover:text-white transition-colors">Bearbeiten</button>
                  <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Löschen</button>
                </div>
              </div>
              <p className="text-slate-400 text-sm">{cat.description}</p>
              <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex flex-wrap gap-1">
                {catCourses.map(c => (
                  <span key={c.id} className="text-xs bg-[#1e1e2e] text-slate-400 px-2 py-0.5 rounded">
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
