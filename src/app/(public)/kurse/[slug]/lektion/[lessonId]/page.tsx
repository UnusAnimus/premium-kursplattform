import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string; lessonId: string }>;
}

export const dynamic = 'force-dynamic';

export default async function LessonPlayerPage({ params }: Props) {
  const { slug, lessonId } = await params;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`/login?callbackUrl=/kurse/${slug}/lektion/${lessonId}`);
  }

  // Fetch lesson with module and course info
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                orderBy: { order: 'asc' },
                include: {
                  lessons: { orderBy: { order: 'asc' } },
                },
              },
              enrollments: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  const course = lesson.module.course;

  // Verify the course slug matches
  if (course.slug !== slug) notFound();

  // Check access: must be enrolled OR lesson is free
  const isEnrolled = course.enrollments.length > 0;
  if (!lesson.isFree && !isEnrolled) {
    redirect(`/kurse/${slug}`);
  }

  // Build flat lesson list for navigation
  const allLessons = course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleTitle: m.title })));
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="bg-[var(--bg-base)] min-h-screen">
      {/* Top bar */}
      <div className="border-b border-[var(--border-base)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href={`/kurse/${slug}`}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm flex items-center gap-2 transition-colors"
          >
            ← {course.title}
          </Link>
          <span className="text-[var(--text-muted)] text-xs">
            Lektion {currentIndex + 1} von {allLessons.length}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video area */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl overflow-hidden">
              {lesson.videoUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-[linear-gradient(135deg,rgba(124,58,237,0.14),rgba(245,158,11,0.08))] flex flex-col items-center justify-center gap-4">
                  <div className="text-6xl opacity-30">▶</div>
                  <p className="text-[var(--text-muted)] text-sm">Kein Video für diese Lektion verfügbar</p>
                </div>
              )}
            </div>

            {/* Lesson info */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-surface-raised)] px-3 py-1 rounded-full">
                  {lesson.module.title}
                </span>
                {lesson.isFree && (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    Kostenlos
                  </span>
                )}
                <span className="text-xs text-[var(--text-muted)] ml-auto">
                  {lesson.durationMin} Min.
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-[var(--text-secondary)] leading-relaxed">{lesson.description}</p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              {prevLesson ? (
                <Link
                  href={`/kurse/${slug}/lektion/${prevLesson.id}`}
                  className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-base)] hover:bg-[var(--bg-surface-hover)] hover:border-violet-500/50 text-[var(--text-primary)] rounded-xl px-5 py-3 text-sm font-medium transition-all text-center"
                >
                  ← Vorherige Lektion
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextLesson ? (
                <Link
                  href={`/kurse/${slug}/lektion/${nextLesson.id}`}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-3 text-sm font-semibold transition-all text-center"
                >
                  Nächste Lektion →
                </Link>
              ) : (
                <div className="flex-1 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl px-5 py-3 text-sm font-medium text-center">
                  ✓ Kurs abgeschlossen!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: course curriculum */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl overflow-hidden sticky top-6">
              <div className="p-4 border-b border-[var(--border-base)]">
                <h2 className="text-[var(--text-primary)] font-semibold text-sm">Kursinhalt</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                {course.modules.map(module => (
                  <div key={module.id}>
                    <div className="px-4 py-2.5 bg-[var(--bg-surface-raised)] border-b border-[var(--border-base)]">
                      <p className="text-[var(--text-secondary)] text-xs font-medium">{module.title}</p>
                    </div>
                    {module.lessons.map(l => {
                      const isCurrent = l.id === lessonId;
                      const accessible = l.isFree || isEnrolled;
                      return (
                        <div key={l.id}>
                          {accessible ? (
                            <Link
                              href={`/kurse/${slug}/lektion/${l.id}`}
                              className={`flex items-center gap-3 px-4 py-3 text-xs border-b border-[var(--border-base)] transition-colors ${
                                isCurrent
                                  ? 'bg-violet-600/20 text-[var(--badge-brand-text)] border-l-2 border-l-violet-500'
                                  : 'text-[var(--text-secondary)] hover:bg-[var(--row-hover)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              <span className={isCurrent ? 'text-[var(--badge-brand-text)]' : 'text-[var(--text-muted)]'}>
                                {isCurrent ? '▶' : '○'}
                              </span>
                              <span className="flex-1 leading-snug">{l.title}</span>
                              <span className="text-[var(--text-muted)] shrink-0">{l.durationMin}m</span>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 px-4 py-3 text-xs border-b border-[var(--border-base)] text-[var(--text-muted)]">
                              <span>🔒</span>
                              <span className="flex-1 leading-snug">{l.title}</span>
                              <span className="shrink-0">{l.durationMin}m</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
