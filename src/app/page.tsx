<<<<<<< HEAD
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Features } from '@/components/sections/Features';
import { CourseCard } from '@/components/sections/CourseCard';
import { PricingCard } from '@/components/sections/PricingCard';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaSection } from '@/components/sections/CtaSection';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { pricingPlans } from '@/lib/data';
import { getPublicCourses } from '@/lib/publicCourses';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const courses = await getPublicCourses();
  const featuredCourses = courses.filter(course => course.featured).slice(0, 3);
  const averageRating = courses.length > 0
    ? courses.reduce((total, course) => total + course.rating, 0) / courses.length
    : 0;

=======
import { Hero }            from '@/components/sections/Hero';
import { ManifestSection }  from '@/components/sections/ManifestSection';
import { StatsSection }     from '@/components/sections/StatsSection';
import { PathsSection }     from '@/components/sections/PathsSection';
import { CourseShowcase }   from '@/components/sections/CourseShowcase';
import { VoicesSection }    from '@/components/sections/VoicesSection';
import { InitiationSection } from '@/components/sections/InitiationSection';
import { InvocationSection } from '@/components/sections/InvocationSection';
import { Navbar }           from '@/components/layout/Navbar';
import { Footer }           from '@/components/layout/Footer';

export default function HomePage() {
>>>>>>> 97e4e65e75df818bf6d759ce825577b16afdcd31
  return (
    <>
      <Navbar />
      <main>
<<<<<<< HEAD
        <Hero courseCount={courses.length} />
        <Stats courseCount={courses.length} averageRating={averageRating} />
        <Features />

        {/* Featured Courses */}
        <section id="kurse" className="py-24 bg-[var(--bg-surface-raised)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
                <span className="text-violet-400 text-sm">◈</span>
                <span className="text-violet-400 text-sm font-medium">Beliebteste Kurse</span>
              </div>
              <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                Unsere{' '}
                <span className="gradient-text">
                  Premium Kurse
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                Entdecke unsere beliebtesten Kurse und beginne deine spirituelle Reise.
              </p>
            </div>
            {featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {featuredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl p-10 text-center mb-10">
                <div className="text-5xl opacity-30 mb-4">◈</div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Noch keine empfohlenen Kurse veröffentlicht</h3>
                <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                  Sobald im Admin-Bereich Kurse als empfohlen markiert sind, erscheinen sie automatisch hier auf der Startseite.
                </p>
              </div>
            )}
            <div className="text-center">
              <Link
                href="/kurse"
                className="border border-violet-500 text-violet-400 hover:bg-violet-500/10 font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Alle Kurse ansehen →
              </Link>
            </div>
          </div>
        </section>

        <Testimonials />

        {/* Pricing Preview */}
        <section id="preise" className="py-24 bg-[var(--bg-surface-raised)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
                <span className="text-violet-400 text-sm">◆</span>
                <span className="text-violet-400 text-sm font-medium">Transparente Preise</span>
              </div>
              <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                Wähle deinen{' '}
                <span className="gradient-text">
                  Lernpfad
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                Flexible Mitgliedschaftsoptionen für jeden Lernenden.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map(plan => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        <CtaSection />
=======
        <Hero />
        <StatsSection />
        <ManifestSection />
        <PathsSection />
        <CourseShowcase />
        <VoicesSection />
        <InitiationSection />
        <InvocationSection />
>>>>>>> 97e4e65e75df818bf6d759ce825577b16afdcd31
      </main>
      <Footer />
    </>
  );
}

