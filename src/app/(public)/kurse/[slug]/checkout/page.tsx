import { courses } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PurchaseButton } from '@/components/courses/PurchaseButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find(c => c.slug === slug);
  if (!course) notFound();

  // Free courses don't need checkout
  if (course.price === 0) {
    redirect(`/kurse/${slug}`);
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/kurse/${slug}/checkout`);
  }

  const userId = session.user.id;
  let isEnrolled = false;
  let firstLessonId: string | null = null;

  try {
    const dbCourse = await prisma.course.findUnique({
      where: { slug },
      include: {
        enrollments: { where: { userId } },
        modules: {
          orderBy: { order: 'asc' },
          take: 1,
          include: {
            lessons: { orderBy: { order: 'asc' }, take: 1 },
          },
        },
      },
    });

    if (dbCourse) {
      isEnrolled = dbCourse.enrollments.length > 0;
      firstLessonId = dbCourse.modules[0]?.lessons[0]?.id ?? null;
    }
  } catch (err) {
    console.error('[checkout] DB error:', err);
    // DB unavailable – proceed with checkout UI
  }

  // Already enrolled → send to course
  if (isEnrolled) {
    const target = firstLessonId
      ? `/kurse/${slug}/lektion/${firstLessonId}`
      : `/kurse/${slug}`;
    redirect(target);
  }

  const savings = course.originalPrice ? course.originalPrice - course.price : 0;

  const categoryIcon: Record<string, string> = {
    Metaphysik: '∞',
    Heilung: '✦',
    Astrologie: '☽',
    Hermetik: '⚗',
    Traumarbeit: '◈',
    Schamanismus: '⬡',
  };

  return (
    <div className="bg-[#0a0a0f] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={`/kurse/${slug}`}
            className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
          >
            ← Zurück zum Kurs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order summary */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Bestellung abschließen</h1>
              <p className="text-slate-400 text-sm">Prüfe deine Bestellung und schließe den Kauf ab.</p>
            </div>

            {/* Course card */}
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-violet-900/40 to-amber-900/20 flex items-center justify-center">
                <span className="text-7xl opacity-30">
                  {categoryIcon[course.category] ?? '◈'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-violet-500/20 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/30">
                    {course.category}
                  </span>
                  <span className="bg-[#1e1e2e] text-slate-400 text-xs px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{course.title}</h2>
                <p className="text-slate-400 text-sm mb-3">{course.description}</p>
                <p className="text-slate-500 text-xs">
                  von <span className="text-violet-400">{course.instructor}</span>
                  {' · '}
                  {course.lessonsCount} Lektionen
                  {' · '}
                  {course.certificate ? 'Mit Zertifikat' : 'Ohne Zertifikat'}
                </p>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Das bekommst du</h3>
              <ul className="space-y-2">
                {[
                  `${course.lessonsCount} Lektionen mit Videoinhalten`,
                  'Lebenslanger Zugriff auf den Kurs',
                  'Zugriff über alle Geräte',
                  ...(course.certificate ? ['Offizielles Zertifikat nach Abschluss'] : []),
                  '30 Tage Geld-zurück-Garantie',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="text-emerald-400 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 sticky top-24 space-y-5">
              <h3 className="text-white font-semibold text-lg">Zusammenfassung</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Kurs</span>
                  <span className="text-slate-300">{course.title}</span>
                </div>
                {course.originalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Originalpreis</span>
                    <span className="text-slate-500 line-through">{formatPrice(course.originalPrice)}</span>
                  </div>
                )}
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Rabatt</span>
                    <span className="text-emerald-400">−{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="border-t border-[#1e1e2e] pt-3 flex justify-between">
                  <span className="text-white font-semibold">Gesamt</span>
                  <span className="text-white font-bold text-xl">{formatPrice(course.price)}</span>
                </div>
              </div>

              <PurchaseButton courseSlug={slug} firstLessonId={firstLessonId} />

              <p className="text-xs text-slate-500 text-center">
                30 Tage Geld-zurück-Garantie. Keine Fragen gestellt.
              </p>

              <div className="border-t border-[#1e1e2e] pt-4">
                <p className="text-xs text-slate-500 text-center">
                  Oder spare mit einem Abo:
                </p>
                <Link
                  href="/preise"
                  className="block w-full mt-2 border border-[#2a2a3e] hover:border-violet-500 text-slate-300 hover:text-white font-medium py-2.5 rounded-xl text-center transition-all text-sm"
                >
                  Abo-Pläne ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
