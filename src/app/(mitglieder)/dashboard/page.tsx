'use client';
import { useSession } from 'next-auth/react';
import { courses } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'zurück';

  // Show the first 3 courses as placeholder enrolled courses
  const enrolledCourses = courses.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück, {userName}! ✦</h1>
        <p className="text-slate-400">Mach weiter, wo du aufgehört hast. Du bist auf dem richtigen Weg.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Belegte Kurse', value: '3', icon: '◈', color: 'text-violet-400' },
          { label: 'Abgeschlossene Lektionen', value: '24', icon: '✓', color: 'text-emerald-400' },
          { label: 'Lernstunden gesamt', value: '18 Std.', icon: '🕐', color: 'text-amber-400' },
          { label: 'Zertifikate', value: '1', icon: '◆', color: 'text-violet-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5">
            <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
            <div className="text-2xl font-bold text-white mt-2 mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Courses in progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Meine Kurse</h2>
          <Link href="/meine-kurse" className="text-violet-400 hover:text-violet-300 text-sm">Alle anzeigen →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enrolledCourses.map((course, i) => {
            const progress = [45, 72, 20][i];
            return (
              <div key={course.id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5 hover:border-violet-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center text-xl text-violet-400">
                    {i === 0 ? '∞' : i === 1 ? '✦' : '☽'}
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium leading-snug">{course.title}</h3>
                    <p className="text-slate-500 text-xs">{course.instructor}</p>
                  </div>
                </div>
                <Progress value={progress} showValue label={`${progress}% abgeschlossen`} />
                <Link href={`/kurse/${course.slug}`} className="mt-4 block text-center text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Weiter lernen →
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: '/ki-assistent', icon: '✦', label: 'KI-Assistent' },
            { href: '/lernfortschritt', icon: '▲', label: 'Fortschritt' },
            { href: '/kurse', icon: '◈', label: 'Neue Kurse' },
            { href: '/abo', icon: '◆', label: 'Mein Abo' },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4 text-center hover:border-violet-500/50 transition-all group"
            >
              <div className="text-2xl text-violet-400 mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
              <div className="text-slate-300 text-sm font-medium">{action.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
