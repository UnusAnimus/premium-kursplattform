'use client';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface Enrollment {
  id: string;
  enrolledAt: string;
  course: {
    id: string;
    slug: string;
    title: string;
    description: string;
    instructor: string;
    category: string;
    level: string;
    lessonsCount: number;
  };
}

const categoryIcon: Record<string, string> = {
  Metaphysik: '∞',
  Heilung: '✦',
  Astrologie: '☽',
  Hermetik: '⚗',
  Traumarbeit: '◈',
  Schamanismus: '⬡',
};

export default function MeineKursePage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/enrollments')
      .then(r => r.ok ? r.json() as Promise<{ enrollments: Enrollment[] }> : Promise.reject())
      .then(data => setEnrollments(data.enrollments))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Meine Kurse</h1>
        <p className="text-[var(--text-secondary)]">Alle deine eingeschriebenen Kurse auf einen Blick.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-[var(--text-muted)] text-sm">Kurse werden geladen…</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl overflow-hidden hover:bg-[var(--bg-surface-hover)] hover:border-violet-500/40 transition-all">
              <div className="relative aspect-video overflow-hidden bg-[var(--bg-surface-raised)] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_52%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_45%)]" />
                <span className="relative z-10 text-6xl opacity-60 text-[var(--badge-brand-text)]">
                  {categoryIcon[enrollment.course.category] ?? '◈'}
                </span>
              </div>
              <div className="p-5">
                <span className="brand-chip text-xs px-2.5 py-1 rounded-full">
                  {enrollment.course.category}
                </span>
                <h3 className="text-[var(--text-primary)] font-semibold mt-3 mb-1">{enrollment.course.title}</h3>
                <p className="text-[var(--text-muted)] text-xs mb-4">von {enrollment.course.instructor}</p>
                <Progress value={0} showValue label="Fortschritt" className="mb-4" />
                {/* TODO: Progress tracking will be implemented once lesson completion events are stored */}
                <Link
                  href={`/kurse/${enrollment.course.slug}`}
                  className="block w-full text-center bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-sm font-medium py-2.5 rounded-lg border border-violet-500/30 hover:border-violet-600 transition-all"
                >
                  Kurs fortsetzen →
                </Link>
              </div>
            </div>
          ))}

          {!loading && enrollments.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-5xl mb-4 opacity-20">◈</div>
              <p className="text-[var(--text-secondary)] mb-4">Du bist noch in keinen Kurs eingeschrieben.</p>
              <Link
                href="/kurse"
                className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-sm"
              >
                Kurse entdecken
              </Link>
            </div>
          )}

          {/* Discover more */}
          <Link
            href="/kurse"
            className="bg-[var(--bg-surface)] border border-dashed border-[var(--border-strong)] rounded-xl flex flex-col items-center justify-center p-8 hover:bg-[var(--bg-surface-hover)] hover:border-violet-500/40 transition-all group aspect-auto min-h-[200px]"
          >
            <div className="text-4xl text-[var(--text-muted)] group-hover:text-[var(--badge-brand-text)] mb-3 transition-colors">+</div>
            <p className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] text-sm text-center transition-colors">Neue Kurse entdecken</p>
          </Link>
        </div>
      )}
    </div>
  );
}

