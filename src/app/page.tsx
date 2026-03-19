import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { Features } from '@/components/sections/Features';
import { CourseCard } from '@/components/sections/CourseCard';
import { PricingCard } from '@/components/sections/PricingCard';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaSection } from '@/components/sections/CtaSection';
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

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
