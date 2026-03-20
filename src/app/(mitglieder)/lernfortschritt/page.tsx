'use client';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface Enrollment {
  id: string;
  enrolledAt: string;
  course: {
    id: string;
    slug: string;
    title: string;
    lessonsCount: number;
  };
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Lernfortschritt</h1>
        <p className="text-[var(--text-secondary)]">Verfolge deine Lernreise und feiere deine Fortschritte.</p>
      </div>

<<<<<<< HEAD
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-[var(--text-primary)] mb-1">{stat.value}</div>
            <div className="text-[var(--text-secondary)] text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Wochenaktivität</h2>
        <div className="flex items-end gap-2 h-32">
          {[40, 65, 30, 80, 45, 90, 55].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-violet-500/80 rounded-t-sm transition-all hover:bg-violet-400"
                style={{ height: `${h}%` }}
              />
              <span className="text-xs text-[var(--text-muted)]">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Kursfortschritt</h2>
        <div className="space-y-4">
          {courseProgress.map(({ course, progress, completedLessons, totalLessons }) => (
            <div key={course.id} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[var(--text-primary)] font-semibold">{course.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm">{completedLessons} von {totalLessons} Lektionen</p>
                </div>
                <span className="text-[var(--badge-brand-text)] font-bold text-xl">{progress}%</span>
=======
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
            {enrollments.map(({ id, course }) => (
              <div key={id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{course.title}</h3>
                    <p className="text-slate-500 text-sm">
                      {course.lessonsCount} {course.lessonsCount === 1 ? 'Lektion' : 'Lektionen'}
                    </p>
                  </div>
                  <span className="text-violet-400 font-bold text-xl">0%</span>
                </div>
                <Progress value={0} size="lg" />
                <p className="text-slate-400 text-xs mt-2">Detailliertes Fortschritt-Tracking wird in Kürze verfügbar sein.</p>
>>>>>>> 97e4e65e75df818bf6d759ce825577b16afdcd31
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
