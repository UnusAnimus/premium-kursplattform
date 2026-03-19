'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface Enrollment {
  id: string;
  enrolledAt: string;
  course: {
    id: string;
    slug: string;
    title: string;
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

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? 'Nutzer';
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/enrollments')
      .then(r => r.ok ? r.json() as Promise<{ enrollments: Enrollment[] }> : Promise.reject())
      .then(data => setEnrollments(data.enrollments))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const recentCourses = enrollments.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Willkommen zurück, {userName}! ✦</h1>
        <p className="text-[var(--text-secondary)]">Mach weiter, wo du aufgehört hast. Du bist auf dem richtigen Weg.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Belegte Kurse', value: loading ? '—' : String(enrollments.length), icon: '◈', color: 'text-violet-400' },
          { label: 'Abgeschlossene Lektionen', value: '0', icon: '✓', color: 'text-emerald-400' },
          { label: 'Lernstunden gesamt', value: '0 Std.', icon: '🕐', color: 'text-amber-400' },
          { label: 'Zertifikate', value: '0', icon: '◆', color: 'text-violet-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-5">
            <span className={`text-2xl ${stat.color}`}>{stat.icon}</span>
            <div className="text-2xl font-bold text-[var(--text-primary)] mt-2 mb-1">{stat.value}</div>
            <div className="text-[var(--text-secondary)] text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Courses in progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Meine Kurse</h2>
          <Link href="/meine-kurse" className="text-violet-400 hover:text-violet-300 text-sm">Alle anzeigen →</Link>
        </div>
        {loading ? (
          <div className="text-[var(--text-muted)] text-sm py-8 text-center">Lade Kurse…</div>
        ) : recentCourses.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-8 text-center">
            <p className="text-[var(--text-secondary)] text-sm mb-4">Du bist noch in keinen Kurs eingeschrieben.</p>
            <Link
              href="/kurse"
              className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-all"
            >
              Kurse entdecken
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCourses.map((enrollment) => (
              <div key={enrollment.id} className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-5 hover:border-violet-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center text-xl text-violet-400">
                    {categoryIcon[enrollment.course.category] ?? '◈'}
                  </div>
                  <div>
                    <h3 className="text-[var(--text-primary)] text-sm font-medium leading-snug">{enrollment.course.title}</h3>
                    <p className="text-[var(--text-muted)] text-xs">{enrollment.course.instructor}</p>
                  </div>
                </div>
                <Progress value={0} showValue label="0% abgeschlossen" />
                <Link href={`/kurse/${enrollment.course.slug}`} className="mt-4 block text-center text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Weiter lernen →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Schnellzugriff</h2>
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
              className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl p-4 text-center hover:border-violet-500/50 transition-all group"
            >
              <div className="text-2xl text-violet-400 mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
              <div className="text-[var(--text-secondary)] text-sm font-medium">{action.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

