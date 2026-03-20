'use client';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface Enrollment {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  course: {
    id: string;
    slug: string;
    title: string;
    lessonsCount: number;
  };
  completedLessons: number;
  progressPercent: number;
}

export default function LernfortschrittPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/enrollments')
      .then(r => r.ok ? r.json() as Promise<{ enrollments: Enrollment[] }> : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(data => setEnrollments(data.enrollments))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const totalCompleted = enrollments.reduce((sum, e) => sum + e.completedLessons, 0);
  const totalLessons = enrollments.reduce((sum, e) => sum + e.course.lessonsCount, 0);
  const finishedCourses = enrollments.filter(e => e.progressPercent === 100).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Lernfortschritt</h1>
        <p className="text-slate-400">Verfolge deine Lernreise und feiere deine Fortschritte.</p>
      </div>

      {/* Summary stats */}
      {!loading && enrollments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-violet-400">{enrollments.length}</p>
            <p className="text-slate-500 text-sm mt-1">Eingeschriebene Kurse</p>
          </div>
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-amber-400">{totalCompleted}</p>
            <p className="text-slate-500 text-sm mt-1">Abgeschlossene Lektionen</p>
          </div>
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5 text-center col-span-2 sm:col-span-1">
            <p className="text-3xl font-bold text-emerald-400">{finishedCourses}</p>
            <p className="text-slate-500 text-sm mt-1">Fertige Kurse</p>
          </div>
        </div>
      )}

      {/* Course Progress */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Kursfortschritt</h2>
        {loading ? (
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-8 text-center text-slate-400">
            Lade Daten…
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-8 text-center">
            <p className="text-slate-400">Du bist noch in keinen Kurs eingeschrieben.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map(({ id, course, completedLessons, progressPercent }) => (
              <div key={id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{course.title}</h3>
                    <p className="text-slate-500 text-sm">
                      {completedLessons} / {course.lessonsCount} {course.lessonsCount === 1 ? 'Lektion' : 'Lektionen'} abgeschlossen
                    </p>
                  </div>
                  <span className={`font-bold text-xl ${progressPercent === 100 ? 'text-emerald-400' : 'text-violet-400'}`}>
                    {progressPercent}%
                  </span>
                </div>
                <Progress value={progressPercent} size="lg" />
                {progressPercent === 100 && (
                  <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                    <span>✓</span> Kurs abgeschlossen!
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overall progress */}
      {!loading && totalLessons > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Gesamtfortschritt</h2>
          <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 text-sm">Alle Kurse zusammen</span>
              <span className="text-violet-400 font-bold">
                {Math.round((totalCompleted / totalLessons) * 100)}%
              </span>
            </div>
            <Progress value={Math.round((totalCompleted / totalLessons) * 100)} size="lg" />
          </div>
        </div>
      )}
    </div>
  );
}
