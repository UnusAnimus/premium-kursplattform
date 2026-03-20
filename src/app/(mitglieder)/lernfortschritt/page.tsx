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
        <h1 className="text-3xl font-bold text-white mb-2">Lernfortschritt</h1>
        <p className="text-slate-400">Verfolge deine Lernreise und feiere deine Fortschritte.</p>
      </div>

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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
