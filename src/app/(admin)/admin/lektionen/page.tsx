import { courses } from '@/lib/data';

export default function AdminLektionenPage() {
  const allLessons = courses.flatMap(course =>
    course.modules.flatMap(mod =>
      mod.lessons.map(lesson => ({
        ...lesson,
        courseName: course.title,
        moduleTitle: mod.title,
        courseSlug: course.slug,
      }))
    )
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Lektionen verwalten</h1>
          <p className="text-slate-400">{allLessons.length} Lektionen gesamt</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          + Neue Lektion
        </button>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['Lektion', 'Kurs', 'Modul', 'Dauer', 'Kostenlos', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {allLessons.map(lesson => (
              <tr key={lesson.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4">
                  <p className="text-white font-medium">{lesson.title}</p>
                  <p className="text-slate-500 text-xs">{lesson.description}</p>
                </td>
                <td className="p-4 text-slate-300 text-xs">{lesson.courseName}</td>
                <td className="p-4 text-slate-400 text-xs">{lesson.moduleTitle}</td>
                <td className="p-4 text-slate-300">{lesson.duration} Min.</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${lesson.isFree ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#1e1e2e] text-slate-500'}`}>
                    {lesson.isFree ? 'Kostenlos' : 'Bezahlt'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-xs text-slate-400 hover:text-white transition-colors">Bearbeiten</button>
                    <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Löschen</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
