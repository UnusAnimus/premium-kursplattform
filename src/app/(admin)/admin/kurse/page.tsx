import { courses } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function AdminKursePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Kurse verwalten</h1>
          <p className="text-slate-400">Alle {courses.length} Kurse</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm">
          + Neuer Kurs
        </button>
      </div>

      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1e1e2e]">
            <tr>
              {['Kurs', 'Kategorie', 'Niveau', 'Preis', 'Studierende', 'Bewertung', 'Aktionen'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium p-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-white/2 transition-colors">
                <td className="p-4">
                  <div>
                    <p className="text-white font-medium">{course.title}</p>
                    <p className="text-slate-500 text-xs">von {course.instructor}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-violet-500/10 text-violet-300 text-xs px-2.5 py-1 rounded-full">{course.category}</span>
                </td>
                <td className="p-4 text-slate-300">{course.level}</td>
                <td className="p-4 text-white font-medium">{formatPrice(course.price)}</td>
                <td className="p-4 text-slate-300">{course.studentsCount.toLocaleString('de-DE')}</td>
                <td className="p-4 text-amber-400">★ {course.rating}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/kurse/${course.slug}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Ansehen</Link>
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
