'use client';
import { useEffect, useRef } from 'react';
import { testimonials } from '@/lib/data';

export function VoicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    sectionRef.current?.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const featured = testimonials.slice(0, 6);

  return (
    <section
      id="stimmen"
      ref={sectionRef}
      className="relative overflow-hidden py-32 lg:py-40"
      style={{ background: 'linear-gradient(180deg, #0b0b14 0%, #10101c 50%, #0b0b14 100%)' }}
    >
      {/* Background orb */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(61,26,138,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 flex items-center justify-center gap-4 mb-8"
          >
            <div className="gold-line w-12" />
            <span className="label-text text-[var(--gold)] tracking-[0.3em]">Stimmen der Gemeinschaft</span>
            <div className="gold-line w-12" />
          </div>
          <h2
            className="scroll-reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100 text-[var(--pearl)]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Was der Weg{' '}
            <span className="gradient-gold">bewirkt</span>
          </h2>
        </div>

        {/* Testimonials – staggered masonry-like grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((t, i) => (
            <div
              key={t.id}
              className={`scroll-reveal opacity-0 translate-y-10 transition-all duration-1000 ${
                i === 1 ? 'md:mt-8' : i === 3 ? 'lg:mt-14' : i === 5 ? 'lg:mt-6' : ''
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <blockquote
                className="h-full p-8 flex flex-col"
                style={{
                  background: 'linear-gradient(135deg, rgba(22,22,37,0.8) 0%, rgba(16,16,28,0.6) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'border-color 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span
                      key={si}
                      style={{ color: si < t.rating ? 'var(--gold)' : 'rgba(255,255,255,0.1)', fontSize: '0.7rem' }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Opening mark */}
                <div
                  className="text-5xl leading-none mb-3 opacity-30"
                  style={{ color: 'var(--gold)', fontFamily: 'Georgia, serif' }}
                >
                  &ldquo;
                </div>

                {/* Quote */}
                <p className="text-[var(--pearl-dim)] leading-relaxed text-sm flex-1 mb-6">
                  {t.content}
                </p>

                {t.courseTitle && (
                  <p className="label-text text-[10px] text-[var(--gold)] tracking-widest mb-5">
                    {t.courseTitle}
                  </p>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 pt-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--obsidian)] text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--gold-light), var(--gold))' }}
                  >
                    {t.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[var(--pearl)] text-sm font-semibold">{t.name}</p>
                    <p className="text-[var(--pearl-muted)] text-xs">{t.role}</p>
                  </div>
                </div>
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scroll-reveal.in-view { opacity: 1 !important; transform: translate(0,0) !important; }
      `}</style>
    </section>
  );
}
