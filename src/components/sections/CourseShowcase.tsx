'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { courses } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export function CourseShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const targets = sectionRef.current?.querySelectorAll('.scroll-reveal');
    targets?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featured = courses.filter((c) => c.featured).slice(0, 3);

  return (
    <section
      id="kurse"
      ref={sectionRef}
      className="relative overflow-hidden py-32 lg:py-40"
      style={{ background: 'linear-gradient(180deg, #0b0b14 0%, #10101c 60%, #0b0b14 100%)' }}
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(61,26,138,0.1) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 max-w-2xl scroll-reveal opacity-0 translate-y-8 transition-all duration-1000">
          <div className="flex items-center gap-4 mb-8">
            <div className="gold-line w-10" />
            <span className="label-text text-[var(--gold)] tracking-[0.3em]">Lehrangebote</span>
          </div>
          <h2
            className="text-[var(--pearl)] mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Kurse, die{' '}
            <span className="gradient-gold">verändern</span>
          </h2>
          <p className="text-[var(--pearl-dim)] leading-relaxed" style={{ fontSize: '1.1rem' }}>
            Handverlesene Lehrangebote aus Metaphysik, Heilung, Astrologie und hermetischer Philosophie.
            Jeder Kurs ein eigenständiger Initiationsweg.
          </p>
        </div>

        {/* Course cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {featured.map((course, i) => (
            <Link
              key={course.id}
              href={`/kurse/${course.slug}`}
              className={`group scroll-reveal opacity-0 translate-y-12 transition-all duration-1000 block`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <article className="h-full premium-card rounded-none overflow-hidden flex flex-col">
                {/* Image / placeholder */}
                <div
                  className="relative h-52 overflow-hidden flex-shrink-0"
                  style={{
                    background: [
                      'linear-gradient(135deg, #1a0844 0%, #3d1a8a 50%, #0b0b14 100%)',
                      'linear-gradient(135deg, #0b1a0b 0%, #1a3d1a 50%, #0b0b14 100%)',
                      'linear-gradient(135deg, #1a1208 0%, #3d2e0a 50%, #0b0b14 100%)',
                    ][i % 3],
                  }}
                >
                  {/* Decorative glyph */}
                  <div
                    className="absolute inset-0 flex items-center justify-center text-8xl opacity-10 transition-transform duration-700 group-hover:scale-110"
                    style={{ fontFamily: 'serif' }}
                  >
                    {['∞', '✦', '☽'][i % 3]}
                  </div>
                  {/* Level badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="label-text text-[10px] px-3 py-1"
                      style={{
                        background: 'rgba(5,5,8,0.7)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: 'var(--gold-light)',
                        letterSpacing: '0.2em',
                      }}
                    >
                      {course.level}
                    </span>
                  </div>
                  {/* Bottom gradient */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20"
                    style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.9), transparent)' }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6 lg:p-8">
                  {/* Category */}
                  <span className="label-text text-[var(--gold)] tracking-widest text-[10px] mb-3">
                    {course.category}
                  </span>
                  {/* Title */}
                  <h3
                    className="text-[var(--pearl)] font-bold mb-3 group-hover:text-[var(--gold-light)] transition-colors duration-300"
                    style={{ fontSize: '1.15rem', letterSpacing: '-0.01em', lineHeight: 1.3 }}
                  >
                    {course.title}
                  </h3>
                  {/* Description */}
                  <p className="text-[var(--pearl-muted)] text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {course.description}
                  </p>
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-5"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <span className="text-[var(--gold)] font-bold text-lg">{formatPrice(course.price)}</span>
                      {course.originalPrice && (
                        <span className="text-[var(--pearl-muted)] line-through text-sm ml-2">
                          {formatPrice(course.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[var(--pearl-muted)] text-xs">
                      <span style={{ color: 'var(--gold)' }}>★</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="scroll-reveal opacity-0 translate-y-4 transition-all duration-700 delay-500">
          <Link
            href="/kurse"
            className="group inline-flex items-center gap-3 text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors duration-300"
          >
            <span className="label-text tracking-widest">Alle Kurse ansehen</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      <style>{`
        .scroll-reveal.in-view { opacity: 1 !important; transform: translate(0,0) !important; }
      `}</style>
    </section>
  );
}
