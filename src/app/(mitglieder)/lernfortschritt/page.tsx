import { Progress } from '@/components/ui/progress';
import { courses } from '@/lib/data';

export default function LernfortschrittPage() {
  const stats = [
    { label: 'Gesamtlernzeit', value: '18 Std. 34 Min.', icon: '🕐' },
    { label: 'Diese Woche', value: '3 Std. 12 Min.', icon: '📅' },
    { label: 'Abgeschlossene Lektionen', value: '24 von 68', icon: '✓' },
    { label: 'Lerntage in Folge', value: '7 Tage', icon: '🔥' },
  ];

  const courseProgress = [
    { course: courses[0], progress: 45, completedLessons: 22, totalLessons: 48 },
    { course: courses[1], progress: 72, completedLessons: 40, totalLessons: 56 },
    { course: courses[2], progress: 20, completedLessons: 14, totalLessons: 72 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Lernfortschritt</h1>
        <p className="text-slate-400">Verfolge deine Lernreise und feiere deine Fortschritte.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Wochenaktivität</h2>
        <div className="flex items-end gap-2 h-32">
          {[40, 65, 30, 80, 45, 90, 55].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-violet-500/80 rounded-t-sm transition-all hover:bg-violet-400"
                style={{ height: `${h}%` }}
              />
              <span className="text-xs text-slate-500">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Kursfortschritt</h2>
        <div className="space-y-4">
          {courseProgress.map(({ course, progress, completedLessons, totalLessons }) => (
            <div key={course.id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">{course.title}</h3>
                  <p className="text-slate-500 text-sm">{completedLessons} von {totalLessons} Lektionen</p>
                </div>
                <span className="text-violet-400 font-bold text-xl">{progress}%</span>
              </div>
              <Progress value={progress} size="lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
