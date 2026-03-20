import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PurchaseButton } from '@/components/courses/PurchaseButton';
import { getPublicCourseBySlug } from '@/lib/publicCourses';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug);
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
  const firstLessonId = course.modules[0]?.lessons[0]?.id ?? null;

  try {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    isEnrolled = !!enrollment;
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
    <div className="bg-[var(--bg-base)] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={`/kurse/${slug}`}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm flex items-center gap-2 transition-colors"
          >
            ← Zurück zum Kurs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order summary */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Bestellung abschließen</h1>
              <p className="text-[var(--text-secondary)] text-sm">Prüfe deine Bestellung und schließe den Kauf ab.</p>
            </div>

            {/* Course card */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-[var(--bg-surface-raised)] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_52%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_45%)]" />
                <span className="relative z-10 text-7xl opacity-60 text-[var(--badge-brand-text)]">
                  {categoryIcon[course.category] ?? '◈'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="brand-chip text-xs px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="surface-subtle text-[var(--text-secondary)] text-xs px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">{course.title}</h2>
                <p className="text-[var(--text-secondary)] text-sm mb-3">{course.description}</p>
                <p className="text-[var(--text-muted)] text-xs">
                  von <span className="text-[var(--badge-brand-text)]">{course.instructor}</span>
                  {' · '}
                  {course.lessonsCount} Lektionen
                  {' · '}
                  {course.certificate ? 'Mit Zertifikat' : 'Ohne Zertifikat'}
                </p>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-6">
              <h3 className="text-[var(--text-primary)] font-semibold mb-4">Das bekommst du</h3>
              <ul className="space-y-2">
                {[
                  `${course.lessonsCount} Lektionen mit Videoinhalten`,
                  'Lebenslanger Zugriff auf den Kurs',
                  'Zugriff über alle Geräte',
                  ...(course.certificate ? ['Offizielles Zertifikat nach Abschluss'] : []),
                  '30 Tage Geld-zurück-Garantie',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
                    <span className="text-emerald-500 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-6 sticky top-24 space-y-5 shadow-[var(--shadow-sm)]">
              <h3 className="text-[var(--text-primary)] font-semibold text-lg">Zusammenfassung</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Kurs</span>
                  <span className="text-[var(--text-primary)]">{course.title}</span>
                </div>
                {course.originalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Originalpreis</span>
                    <span className="text-[var(--text-muted)] line-through">{formatPrice(course.originalPrice)}</span>
                  </div>
                )}
                {savings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Rabatt</span>
                    <span className="text-emerald-400">−{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="border-t border-[var(--border-base)] pt-3 flex justify-between">
                  <span className="text-[var(--text-primary)] font-semibold">Gesamt</span>
                  <span className="text-[var(--text-primary)] font-bold text-xl">{formatPrice(course.price)}</span>
                </div>
              </div>

              <PurchaseButton courseSlug={slug} firstLessonId={firstLessonId} />

              <p className="text-xs text-[var(--text-muted)] text-center">
                30 Tage Geld-zurück-Garantie. Keine Fragen gestellt.
              </p>

              <div className="border-t border-[var(--border-base)] pt-4">
                <p className="text-xs text-[var(--text-muted)] text-center">
                  Oder spare mit einem Abo:
                </p>
                <Link
                  href="/preise"
                  className="block w-full mt-2 border border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] hover:border-violet-500 text-[var(--text-primary)] font-medium py-2.5 rounded-xl text-center transition-all text-sm"
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
