import { courses } from '@/lib/data';
import { formatPrice, formatDuration } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return courses.map(course => ({ slug: course.slug }));
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find(c => c.slug === slug);
  if (!course) notFound();

  const totalDuration = course.modules.reduce((acc, mod) =>
    acc + mod.lessons.reduce((a, l) => a + l.duration, 0), 0
  );

  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-violet-950/30 to-[#0a0a0f] border-b border-[#1e1e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-violet-500/20 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/30">
                  {course.category}
                </span>
                <span className="bg-[#1e1e2e] text-slate-400 text-xs px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">{course.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={star <= Math.round(course.rating) ? 'text-amber-400' : 'text-slate-600'}>★</span>
                  ))}
                </div>
                <span className="text-amber-400 font-semibold">{course.rating}</span>
                <span className="text-slate-500">({course.reviewsCount} Bewertungen)</span>
              </div>

              <p className="text-slate-400 text-sm mb-8">
                Erstellt von <span className="text-violet-400 font-medium">{course.instructor}</span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: '🕐', label: 'Dauer', value: formatDuration(totalDuration) },
                  { icon: '◈', label: 'Lektionen', value: `${course.lessonsCount}` },
                  { icon: '◎', label: 'Studierende', value: `${course.studentsCount.toLocaleString('de-DE')}` },
                  { icon: '◆', label: 'Zertifikat', value: course.certificate ? 'Ja' : 'Nein' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4">
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                    <div className="text-white font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar enrollment card */}
            <div className="lg:col-span-1">
              <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 sticky top-24">
                <div className="aspect-video bg-gradient-to-br from-violet-900/40 to-amber-900/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-7xl opacity-40">
                    {course.category === 'Metaphysik' ? '∞' : course.category === 'Heilung' ? '✦' : course.category === 'Astrologie' ? '☽' : course.category === 'Hermetik' ? '⚗' : course.category === 'Traumarbeit' ? '◈' : '⬡'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-white">{formatPrice(course.price)}</span>
                  {course.originalPrice && (
                    <span className="text-slate-500 text-lg line-through">{formatPrice(course.originalPrice)}</span>
                  )}
                </div>
                {course.originalPrice && (
                  <p className="text-emerald-400 text-sm mb-6">
                    Du sparst {formatPrice(course.originalPrice - course.price)}!
                  </p>
                )}
                <Link
                  href="/login"
                  className="block w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl text-center transition-all hover:shadow-lg hover:shadow-violet-500/30 mb-3"
                >
                  Jetzt einschreiben ✦
                </Link>
                <Link
                  href="/preise"
                  className="block w-full border border-[#2a2a3e] hover:border-violet-500 text-slate-300 hover:text-white font-semibold py-3 rounded-xl text-center transition-all text-sm"
                >
                  Mit Abo – ab 29 €/Monat
                </Link>
                <p className="text-xs text-slate-500 text-center mt-4">30 Tage Geld-zurück-Garantie</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Über diesen Kurs</h2>
              <p className="text-slate-400 leading-relaxed">{course.longDescription}</p>
            </div>

            {/* Instructor */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Dein Lehrmeister</h2>
              <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 flex gap-4">
                <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{course.instructor}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{course.instructorBio}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Themen</h2>
              <div className="flex flex-wrap gap-2">
                {course.tags.map(tag => (
                  <span key={tag} className="bg-violet-500/10 text-violet-300 border border-violet-500/30 text-sm px-4 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Kursinhalt</h2>
              <div className="space-y-4">
                {course.modules.map(module => (
                  <div key={module.id} className="bg-[#13131a] border border-[#1e1e2e] rounded-xl overflow-hidden">
                    <div className="p-5 bg-[#1a1a24]">
                      <h3 className="text-white font-semibold">{module.title}</h3>
                      <p className="text-slate-500 text-sm">{module.description}</p>
                    </div>
                    <ul className="divide-y divide-[#1e1e2e]">
                      {module.lessons.map(lesson => (
                        <li key={lesson.id} className="flex items-center gap-4 px-5 py-3.5">
                          <span className={lesson.isFree ? 'text-emerald-400' : 'text-slate-600'}>
                            {lesson.isFree ? '▶' : '🔒'}
                          </span>
                          <span className="flex-1 text-slate-300 text-sm">{lesson.title}</span>
                          {lesson.isFree && (
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              Kostenlos
                            </span>
                          )}
                          <span className="text-slate-500 text-xs">{lesson.duration} Min.</span>
                        </li>
                      ))}
                    </ul>
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
