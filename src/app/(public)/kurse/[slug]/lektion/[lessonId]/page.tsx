import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LessonCompleteButton } from '@/components/courses/LessonCompleteButton';

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

  // Fetch lesson with module and course info (including completions for sidebar)
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
                  lessons: {
                    orderBy: { order: 'asc' },
                    include: {
                      completions: { where: { userId }, select: { id: true } },
                    },
                  },
                },
              },
              enrollments: {
                where: { userId },
              },
            },
          },
        },
      },
      completions: {
        where: { userId },
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

  const isCompleted = lesson.completions.length > 0;

  // Build completed set from the already-fetched data (no extra DB query)
  const completedSet = new Set(
    course.modules.flatMap(m => m.lessons.flatMap(l => l.completions.map(() => l.id)))
  );

  // Build flat lesson list for navigation
  const allLessons = course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleTitle: m.title })));
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Top bar */}
      <div className="border-b border-[#1e1e2e] bg-[#13131a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href={`/kurse/${slug}`}
            className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
          >
            ← {course.title}
          </Link>
          <span className="text-slate-500 text-xs">
            Lektion {currentIndex + 1} von {allLessons.length}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video area */}
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
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
                <div className="aspect-video bg-gradient-to-br from-violet-900/30 to-amber-900/10 flex flex-col items-center justify-center gap-4">
                  <div className="text-6xl opacity-30">▶</div>
                  <p className="text-slate-500 text-sm">Kein Video für diese Lektion verfügbar</p>
                </div>
              )}
            </div>

            {/* Lesson info */}
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 bg-[#1e1e2e] px-3 py-1 rounded-full">
                  {lesson.module.title}
                </span>
                {lesson.isFree && (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    Kostenlos
                  </span>
                )}
                <span className="text-xs text-slate-500 ml-auto">
                  {lesson.durationMin} Min.
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-slate-400 leading-relaxed">{lesson.description}</p>
              )}
              {isEnrolled && (
                <div className="pt-2">
                  <LessonCompleteButton lessonId={lessonId} initialCompleted={isCompleted} />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              {prevLesson ? (
                <Link
                  href={`/kurse/${slug}/lektion/${prevLesson.id}`}
                  className="flex-1 bg-[#13131a] border border-[#1e1e2e] hover:border-violet-500/50 text-slate-300 hover:text-white rounded-xl px-5 py-3 text-sm font-medium transition-all text-center"
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
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden sticky top-6">
              <div className="p-4 border-b border-[#1e1e2e]">
                <h2 className="text-white font-semibold text-sm">Kursinhalt</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                {course.modules.map(module => (
                  <div key={module.id}>
                    <div className="px-4 py-2.5 bg-[#1a1a24] border-b border-[#1e1e2e]">
                      <p className="text-slate-400 text-xs font-medium">{module.title}</p>
                    </div>
                    {module.lessons.map(l => {
                      const isCurrent = l.id === lessonId;
                      const accessible = l.isFree || isEnrolled;
                      const isDone = completedSet.has(l.id);
                      return (
                        <div key={l.id}>
                          {accessible ? (
                            <Link
                              href={`/kurse/${slug}/lektion/${l.id}`}
                              className={`flex items-center gap-3 px-4 py-3 text-xs border-b border-[#1e1e2e] transition-colors ${
                                isCurrent
                                  ? 'bg-violet-600/20 text-violet-300 border-l-2 border-l-violet-500'
                                  : 'text-slate-400 hover:bg-white/2 hover:text-white'
                              }`}
                            >
                              <span className={isCurrent ? 'text-violet-400' : isDone ? 'text-emerald-500' : 'text-slate-600'}>
                                {isCurrent ? '▶' : isDone ? '✓' : '○'}
                              </span>
                              <span className="flex-1 leading-snug">{l.title}</span>
                              <span className="text-slate-600 shrink-0">{l.durationMin}m</span>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 px-4 py-3 text-xs border-b border-[#1e1e2e] text-slate-600">
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
