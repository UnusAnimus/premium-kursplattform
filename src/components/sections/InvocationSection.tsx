'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export function InvocationSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.2 }
    );
    sectionRef.current?.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-40 lg:py-52"
      style={{
        background: 'radial-gradient(ellipse 140% 100% at 50% 60%, #1a0844 0%, #0b0b14 45%, #050508 100%)',
      }}
    >
      {/* Atmospheric layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Large glow orb */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-breathe"
          style={{
            background: 'radial-gradient(ellipse, rgba(61,26,138,0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Gold shimmer top */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-32 opacity-25"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--gold))' }}
        />
        {/* Gold shimmer bottom */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-32 opacity-25"
          style={{ background: 'linear-gradient(to top, transparent, var(--gold))' }}
        />
        {/* Floating glyphs */}
        <div
          className="absolute top-1/4 left-[15%] text-5xl animate-drift opacity-10"
          style={{ color: 'var(--gold)', fontFamily: 'serif', animationDuration: '18s' }}
        >
          ∞
        </div>
        <div
          className="absolute bottom-1/4 right-[15%] text-4xl animate-drift opacity-10"
          style={{ color: 'var(--gold)', fontFamily: 'serif', animationDuration: '14s', animationDelay: '-6s' }}
        >
          ◈
        </div>
        {/* Thin circles */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full animate-spin-slow opacity-5"
          style={{ border: '1px solid var(--gold)' }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-spin-slow opacity-[0.03]"
          style={{ border: '1px solid var(--gold)', animationDirection: 'reverse', animationDuration: '40s' }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Label */}
        <div className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 flex items-center justify-center gap-4 mb-12">
          <div className="gold-line w-12" />
          <span className="label-text text-[var(--gold)] tracking-[0.3em]">Dein Weg beginnt</span>
          <div className="gold-line w-12" />
        </div>

        {/* Headline */}
        <h2
          className="scroll-reveal opacity-0 translate-y-12 transition-all duration-1100 delay-100 text-[var(--pearl)] mb-8"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            textShadow: '0 0 80px rgba(201,168,76,0.15)',
          }}
        >
          Bist du bereit,<br />
          <span className="gradient-gold">tiefer</span> zu gehen?
        </h2>

        {/* Body */}
        <p
          className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 delay-200 text-[var(--pearl-dim)] max-w-2xl mx-auto mb-14 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}
        >
          Keine Ablenkungen. Keine Oberflächlichkeit. Nur du, die Lehren und die stille Stärke
          dessen, der wirklich wissen will.
        </p>

        {/* CTA Buttons */}
        <div className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 delay-300 flex flex-col sm:flex-row gap-5 justify-center mb-16">
          <Link href="/login">
            <button
              className="group relative inline-flex items-center gap-3 px-10 py-5 font-semibold overflow-hidden transition-all duration-500"
              style={{ background: 'linear-gradient(135deg, var(--gold-pale), var(--gold-light), var(--gold))' }}
            >
              <span className="relative z-10 label-text text-[var(--obsidian)] tracking-widest">
                Jetzt der Akademie beitreten
              </span>
              <span className="relative z-10 text-[var(--obsidian)] transition-transform duration-300 group-hover:translate-x-1">→</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, #fff8e8, var(--gold-pale))' }}
              />
            </button>
          </Link>
          <Link href="/kurse">
            <button
              className="inline-flex items-center gap-3 px-10 py-5 font-semibold label-text tracking-widest border border-[rgba(201,168,76,0.3)] text-[var(--gold)] hover:border-[rgba(201,168,76,0.6)] hover:text-[var(--gold-light)] transition-all duration-400"
              style={{ background: 'rgba(201,168,76,0.04)' }}
            >
              Kurse entdecken
            </button>
          </Link>
        </div>

        {/* Trust line */}
        <div
          className="scroll-reveal opacity-0 transition-all duration-700 delay-500 flex flex-wrap items-center justify-center gap-6"
          style={{ color: 'var(--pearl-muted)', fontSize: '0.75rem' }}
        >
          {['Keine Vertragsbindung', '14 Tage Rückgaberecht', 'Sofortiger Zugang'].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span style={{ color: 'rgba(201,168,76,0.3)' }}>·</span>}
              {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .scroll-reveal.in-view { opacity: 1 !important; transform: translate(0,0) !important; }
      `}</style>
    </section>
  );
}
