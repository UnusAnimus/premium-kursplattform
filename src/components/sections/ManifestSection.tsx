'use client';
import { useEffect, useRef } from 'react';

const pillars = [
  {
    symbol: '∞',
    title: 'Hermetisches Wissen',
    text: 'Die Gesetze, die das Universum bewegen — übermittelt von Meister zu Schüler seit Anbeginn der Zeit.',
  },
  {
    symbol: '◎',
    title: 'Innere Transformation',
    text: 'Nicht bloßes Lernen. Ein fundamentaler Wandel in der Art, wie du die Welt — und dich selbst — wahrnimmst.',
  },
  {
    symbol: '⬡',
    title: 'Lebendige Gemeinschaft',
    text: 'Gleichgesinnte auf dem Weg. Eine Gemeinschaft, die nicht Bestätigung sucht, sondern Wahrheit.',
  },
];

export function ManifestSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    const targets = sectionRef.current?.querySelectorAll('.scroll-reveal');
    targets?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="manifest"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050508 0%, #0b0b14 50%, #050508 100%)' }}
    >
      {/* Top divider */}
      <div className="gold-line w-full opacity-30" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        {/* Editorial label */}
        <div className="flex items-center gap-4 mb-16 scroll-reveal opacity-0 translate-y-8 transition-all duration-1000">
          <div className="gold-line w-12" />
          <span className="label-text text-[var(--gold)] tracking-[0.3em]">Das Arkanum</span>
        </div>

        {/* Big statement */}
        <div className="mb-20">
          <h2
            className="scroll-reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--pearl)',
              maxWidth: '16ch',
            }}
          >
            Wissen ist{' '}
            <span className="gradient-gold">nicht</span>{' '}
            das Ziel —
            <br />
            <span style={{ color: 'var(--pearl-dim)' }}>Erwachen ist es.</span>
          </h2>
        </div>

        {/* Body copy – left-right split */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24 items-start">
          <p
            className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 delay-200 text-[var(--pearl-dim)] leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
          >
            Die Arkanum Akademie ist kein Kursanbieter. Sie ist ein Raum der Initiation —
            ein sorgfältig gehütetes Portal zu den tiefen Ordnungen der Wirklichkeit.
            Wir lehren das, was zwischen den Zeilen der Schulbücher steht.
          </p>
          <p
            className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 delay-300 text-[var(--pearl-muted)] leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
          >
            Jeder Kurs ist ein Schritt tiefer in die Architektur des Seins. Jede Lektion
            ein Spiegel, in dem du nicht Information findest — sondern dich selbst.
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-px">
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`scroll-reveal opacity-0 translate-y-12 transition-all duration-1000`}
              style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
            >
              <div
                className="h-full p-8 lg:p-10 group hover:bg-[rgba(201,168,76,0.03)] transition-colors duration-500"
                style={{ borderLeft: i === 0 ? '1px solid rgba(201,168,76,0.15)' : '1px solid rgba(201,168,76,0.08)' }}
              >
                {/* Symbol */}
                <div
                  className="text-3xl mb-6 transition-transform duration-500 group-hover:scale-110"
                  style={{ color: 'var(--gold)', fontFamily: 'serif' }}
                >
                  {p.symbol}
                </div>
                {/* Title */}
                <h3
                  className="text-[var(--pearl)] font-semibold mb-3"
                  style={{ fontSize: '1.1rem', letterSpacing: '-0.01em' }}
                >
                  {p.title}
                </h3>
                {/* Text */}
                <p className="text-[var(--pearl-muted)] text-sm leading-relaxed">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div ref={lineRef} className="gold-line w-full opacity-20" />

      {/* Inline style for scroll-reveal animations */}
      <style>{`
        .scroll-reveal.in-view {
          opacity: 1 !important;
          transform: translate(0,0) !important;
        }
      `}</style>
    </section>
  );
}
