'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

<<<<<<< HEAD
interface HeroProps {
  courseCount: number;
}

export function Hero({ courseCount }: HeroProps) {
=======
export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle mouse-parallax on the text layer
    const handleMouseMove = (e: MouseEvent) => {
      if (!textRef.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      textRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

>>>>>>> 97e4e65e75df818bf6d759ce825577b16afdcd31
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 140% 100% at 60% 40%, #1a0844 0%, #0b0b14 40%, #050508 100%)' }}
    >
      {/* ── Three.js canvas ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <HeroCanvas />
      </div>

      {/* ── Atmospheric gradient overlays ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 65% 50%, rgba(61,26,138,0.25) 0%, transparent 70%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(201,168,76,0.06) 0%, transparent 65%)' }} />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to top, #050508 0%, transparent 100%)' }} />
        {/* Top vignette */}
        <div className="absolute top-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, rgba(5,5,8,0.6) 0%, transparent 100%)' }} />
      </div>

      {/* ── Floating geometric accents ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Top-left triangle/fragment */}
        <div className="absolute top-24 left-[8%] w-16 h-16 border border-[rgba(201,168,76,0.15)] rotate-45 animate-drift opacity-60"
          style={{ animationDuration: '14s' }} />
        <div className="absolute top-36 left-[10%] w-8 h-8 border border-[rgba(167,139,250,0.2)] rotate-12 animate-drift opacity-40"
          style={{ animationDuration: '18s', animationDelay: '-4s' }} />
        {/* Bottom-right */}
        <div className="absolute bottom-40 right-[8%] w-20 h-20 border border-[rgba(201,168,76,0.12)] rotate-[-20deg] animate-drift opacity-50"
          style={{ animationDuration: '16s', animationDelay: '-8s' }} />
        <div className="absolute bottom-32 right-[12%] w-10 h-10 bg-[rgba(201,168,76,0.04)] rotate-45 animate-float" />
        {/* Small dots */}
        <div className="absolute top-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-[rgba(201,168,76,0.5)] animate-breathe" />
        <div className="absolute top-2/3 right-[25%] w-1 h-1 rounded-full bg-[rgba(167,139,250,0.6)] animate-breathe"
          style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-[5%] w-1 h-1 rounded-full bg-[rgba(201,168,76,0.4)] animate-breathe"
          style={{ animationDelay: '4s' }} />
        {/* Gold thin line – top centre */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 opacity-30"
          style={{ background: 'linear-gradient(to bottom, transparent, #c9a84c)' }} />
      </div>

      {/* ── Hero content ── */}
      <div ref={textRef} className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center"
        style={{ transition: 'transform 0.1s linear', willChange: 'transform' }}>

        {/* Label */}
        <div className="inline-flex items-center gap-3 mb-10 animate-reveal-fade">
          <span className="gold-line w-8" />
          <span className="label-text text-[var(--gold)] tracking-[0.25em]">Arkanum Akademie</span>
          <span className="gold-line w-8" />
        </div>

        {/* Main headline */}
        <h1 className="display-text text-[var(--pearl)] mb-6 animate-reveal-up" style={{ textShadow: '0 0 60px rgba(201,168,76,0.1)' }}>
          Das Tor zum<br />
          <span className="gradient-gold">verborgenen</span><br />
          Wissen
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[var(--pearl-dim)] mb-12 leading-relaxed animate-reveal-up delay-200">
          Hermetische Weisheitslehren. Transformative Praktiken.
          Eine Gemeinschaft von Suchenden — auf dem Weg ins Innere.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-reveal-up delay-300">
          <Link href="#pfade">
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-none font-semibold text-[var(--obsidian)] overflow-hidden transition-all duration-500"
              style={{ background: 'linear-gradient(135deg, #e8d5a3 0%, #c9a84c 50%, #8a6f2e 100%)' }}>
              <span className="relative z-10 label-text tracking-widest">Jetzt eintreten</span>
              <span className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, #f5eed8 0%, #e8d5a3 50%, #c9a84c 100%)' }} />
            </button>
          </Link>
          <Link href="#kurse">
            <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-none font-semibold border border-[rgba(201,168,76,0.4)] text-[var(--gold-light)] hover:border-[var(--gold)] hover:text-[var(--gold-pale)] transition-all duration-400 backdrop-blur-sm"
              style={{ background: 'rgba(201,168,76,0.04)' }}>
              <span className="label-text tracking-widest">Kurse entdecken</span>
            </button>
          </Link>
        </div>

<<<<<<< HEAD
        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-muted)] animate-reveal-up delay-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <span>2.400+ Mitglieder</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <span>{courseCount} Premium-Kurse</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>4.9/5 Bewertung</span>
          </div>
=======
        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 animate-reveal-fade delay-500">
          {[
            { value: '6.000+', label: 'Studierende' },
            { value: '50+',    label: 'Premium-Kurse' },
            { value: '4,9',    label: 'Bewertung' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              {i > 0 && <div className="gold-line-vertical h-8 hidden sm:block" />}
              <div className="text-center">
                <div className="text-2xl font-bold gradient-gold">{s.value}</div>
                <div className="label-text text-[var(--pearl-muted)] mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
>>>>>>> 97e4e65e75df818bf6d759ce825577b16afdcd31
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-reveal-fade delay-800">
        <span className="label-text text-[var(--pearl-muted)] tracking-[0.3em] text-[10px]">Scroll</span>
        <div className="w-px h-10 relative overflow-hidden">
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent, #c9a84c)', animation: 'scroll-bounce 1.8s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}

