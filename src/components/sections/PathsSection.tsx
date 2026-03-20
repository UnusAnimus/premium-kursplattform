'use client';
import { useEffect, useRef } from 'react';

const paths = [
  {
    number: '01',
    symbol: '◈',
    title: 'Metaphysik & Bewusstsein',
    subtitle: 'Die Architektur des Seins',
    desc: 'Erforsche die Grundgesetze des Universums — von antiker Philosophie bis zur modernen Bewusstseinsforschung. Du lernst, wie Gedanken Wirklichkeit formen und was hinter der Oberfläche der sichtbaren Welt liegt.',
    tags: ['Quantenphysik', 'Philosophie', 'Meditation'],
  },
  {
    number: '02',
    symbol: '⚗',
    title: 'Hermetik & Alchemie',
    subtitle: 'Die sieben Prinzipien',
    desc: 'Die ältesten Weisheitslehren der Menschheit, neu entschlüsselt. Das Hermetische Corpus, die Prinzipien des Kybalion und die innere Alchemie als Transformationsweg.',
    tags: ['Hermetik', 'Symbolik', 'Initiation'],
  },
  {
    number: '03',
    symbol: '☽',
    title: 'Astrologie & Kosmologie',
    subtitle: 'Die Sprache der Sphären',
    desc: 'Lerne die Sprache, in der das Universum zu uns spricht — nicht als Horoskop-Unterhaltung, sondern als tiefes symbolisches System zur Selbsterkenntnis und Weltdeutung.',
    tags: ['Geburtshoroskop', 'Planeten', 'Zyklen'],
  },
  {
    number: '04',
    symbol: '◎',
    title: 'Heilung & Energie',
    subtitle: 'Das subtile Leib-System',
    desc: 'Quantenheilung, Energetik und holistische Heilmethoden. Der Körper als energetisches System — lerne, wie du auf feinstofflicher Ebene heilen und transformieren kannst.',
    tags: ['Energiearbeit', 'Chakren', 'Bioenergie'],
  },
];

export function PathsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    sectionRef.current?.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pfade"
      ref={sectionRef}
      className="relative overflow-hidden py-32 lg:py-40"
      style={{ background: '#050508' }}
    >
      {/* Subtle cross-hatch texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000">
            <div className="flex items-center gap-4 mb-8">
              <div className="gold-line w-10" />
              <span className="label-text text-[var(--gold)] tracking-[0.3em]">Lehrpfade</span>
            </div>
            <h2
              className="text-[var(--pearl)]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}
            >
              Wähle deinen{' '}
              <span className="gradient-gold">Initiationsweg</span>
            </h2>
          </div>
          <p
            className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 delay-100 text-[var(--pearl-muted)] max-w-xs leading-relaxed text-sm"
          >
            Jeder Pfad ist ein in sich vollständiges System — nicht Fragmente, sondern ganzheitliche Lehrwege.
          </p>
        </div>

        {/* Path cards – asymmetric layout */}
        <div className="space-y-px">
          {paths.map((path, i) => (
            <div
              key={i}
              className={`scroll-reveal opacity-0 translate-y-6 transition-all duration-1000 group`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                className="grid lg:grid-cols-[140px_1fr_1fr] gap-8 lg:gap-16 px-8 py-10 lg:py-12 items-start
                  hover:bg-[rgba(201,168,76,0.03)] transition-colors duration-500 cursor-default"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                {/* Number + symbol */}
                <div className="flex lg:flex-col gap-4 lg:gap-3 items-center lg:items-start">
                  <span
                    className="label-text tracking-widest"
                    style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.65rem' }}
                  >
                    {path.number}
                  </span>
                  <span
                    className="text-4xl transition-transform duration-500 group-hover:scale-110"
                    style={{ color: 'var(--gold)', fontFamily: 'serif' }}
                  >
                    {path.symbol}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3
                    className="text-[var(--pearl)] font-bold mb-1 group-hover:text-[var(--gold-light)] transition-colors duration-300"
                    style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}
                  >
                    {path.title}
                  </h3>
                  <p className="text-[var(--pearl-muted)] text-sm italic mb-6">{path.subtitle}</p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {path.tags.map((tag) => (
                      <span
                        key={tag}
                        className="label-text text-[10px] px-3 py-1"
                        style={{
                          background: 'rgba(201,168,76,0.05)',
                          border: '1px solid rgba(201,168,76,0.15)',
                          color: 'var(--gold)',
                          letterSpacing: '0.15em',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[var(--pearl-muted)] leading-relaxed text-sm lg:text-base">
                  {path.desc}
                </p>
              </div>
            </div>
          ))}
          {/* Final border */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', height: 0 }} />
        </div>
      </div>

      <style>{`
        .scroll-reveal.in-view { opacity: 1 !important; transform: translate(0,0) !important; }
      `}</style>
    </section>
  );
}
