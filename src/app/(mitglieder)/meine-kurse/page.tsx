import { courses } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function MeineKursePage() {
  const enrolledCourses = courses.slice(0, 3);
  const progresses = [45, 72, 20];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Meine Kurse</h1>
        <p className="text-slate-400">Alle deine eingeschriebenen Kurse auf einen Blick.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course, i) => (
          <div key={course.id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden hover:border-violet-500/50 transition-all">
            <div className="aspect-video bg-gradient-to-br from-violet-900/30 to-amber-900/10 flex items-center justify-center">
              <span className="text-6xl opacity-40">{i === 0 ? '∞' : i === 1 ? '✦' : '☽'}</span>
            </div>
            <div className="p-5">
              <span className="text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2.5 py-1 rounded-full">
                {course.category}
              </span>
              <h3 className="text-white font-semibold mt-3 mb-1">{course.title}</h3>
              <p className="text-slate-500 text-xs mb-4">von {course.instructor}</p>
              <Progress value={progresses[i]} showValue label="Fortschritt" className="mb-4" />
              <Link
                href={`/kurse/${course.slug}`}
                className="block w-full text-center bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-sm font-medium py-2.5 rounded-lg border border-violet-500/30 hover:border-violet-600 transition-all"
              >
                Kurs fortsetzen →
              </Link>
            </div>
          </div>
        ))}

        {/* Discover more */}
        <Link
          href="/kurse"
          className="bg-[#13131a] border border-dashed border-[#2a2a3e] rounded-xl flex flex-col items-center justify-center p-8 hover:border-violet-500/50 transition-all group aspect-auto min-h-[200px]"
        >
          <div className="text-4xl text-slate-600 group-hover:text-violet-400 mb-3 transition-colors">+</div>
          <p className="text-slate-500 group-hover:text-slate-300 text-sm text-center transition-colors">Neue Kurse entdecken</p>
        </Link>
      </div>
    </div>
  );
}
