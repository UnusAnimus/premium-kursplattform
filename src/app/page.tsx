import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Features } from '@/components/sections/Features';
import { CourseCard } from '@/components/sections/CourseCard';
import { PricingCard } from '@/components/sections/PricingCard';
import { Testimonials } from '@/components/sections/Testimonials';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { courses, pricingPlans } from '@/lib/data';
import Link from 'next/link';

export default function HomePage() {
  const featuredCourses = courses.filter(c => c.featured).slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
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

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-b from-[var(--bg-base)] to-violet-950/10 dark:to-violet-950/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6">⬡</div>
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Bereit für deine{' '}
              <span className="gradient-text">
                Transformation?
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
              Tritt der Arkanum Akademie bei und beginne noch heute deine Reise zu tieferem Wissen und spirituellem Wachstum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/30 text-lg"
              >
                Kostenlos starten ✦
              </Link>
              <Link
                href="/kurse"
                className="border border-[var(--border-strong)] hover:border-violet-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold px-8 py-4 rounded-lg transition-all text-lg"
              >
                Kurse entdecken
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
