'use client';
import { useEffect, useRef } from 'react';

const stats = [
  { value: '6.000+', label: 'Aktive Studierende',    symbol: '◎' },
  { value: '50+',    label: 'Premium-Kurse',          symbol: '◈' },
  { value: '4,9',    label: 'Ø Bewertung',            symbol: '★' },
  { value: '98%',    label: 'Zufriedenheitsrate',     symbol: '✦' },
];

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.2 }
    );
    ref.current?.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: '#0b0b14' }}
    >
      <div className="gold-line w-full opacity-20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
          {stats.map((s, i) => (
            <div
              key={i}
              className="scroll-reveal opacity-0 translate-y-6 transition-all duration-800"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div
                className="flex flex-col items-center text-center py-10 px-6 hover:bg-[rgba(201,168,76,0.03)] transition-colors duration-400"
                style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <span
                  className="text-2xl mb-5 opacity-60"
                  style={{ color: 'var(--gold)', fontFamily: 'serif' }}
                >
                  {s.symbol}
                </span>
                <span
                  className="gradient-gold font-bold mb-2 block"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
                >
                  {s.value}
                </span>
                <span className="label-text text-[var(--pearl-muted)] text-[10px] tracking-[0.2em]">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gold-line w-full opacity-20" />

      <style>{`
        .scroll-reveal.in-view { opacity: 1 !important; transform: translate(0,0) !important; }
      `}</style>
    </section>
  );
}
