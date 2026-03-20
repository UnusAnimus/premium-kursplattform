'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { pricingPlans } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

export function InitiationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';
  const ctaHref = isLoggedIn ? (isAdmin ? '/admin' : '/dashboard') : '/login';

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
      id="preise"
      ref={sectionRef}
      className="relative overflow-hidden py-32 lg:py-40"
      style={{ background: 'linear-gradient(180deg, #0b0b14 0%, #050508 100%)' }}
    >
      {/* Geometric background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-40 opacity-20"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--gold))' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(26,8,68,0.3) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="scroll-reveal opacity-0 translate-y-8 transition-all duration-1000 flex items-center justify-center gap-4 mb-8">
            <div className="gold-line w-12" />
            <span className="label-text text-[var(--gold)] tracking-[0.3em]">Initiation</span>
            <div className="gold-line w-12" />
          </div>
          <h2
            className="scroll-reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100 text-[var(--pearl)] mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Wähle deinen{' '}
            <span className="gradient-gold">Grad</span>
          </h2>
          <p
            className="scroll-reveal opacity-0 translate-y-6 transition-all duration-1000 delay-200 text-[var(--pearl-muted)] max-w-xl mx-auto"
            style={{ fontSize: '1rem', lineHeight: 1.7 }}
          >
            Jede Mitgliedschaft ist ein Zugang zu einer anderen Tiefe der Erkenntnis.
            Wähle deinen Einstieg — du kannst jederzeit weiter aufsteigen.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.id}
              className={`scroll-reveal opacity-0 translate-y-12 transition-all duration-1000`}
              style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
            >
              <div
                className={`relative h-full flex flex-col p-8 lg:p-10 transition-all duration-500
                  hover:-translate-y-2`}
                style={{
                  background: plan.highlighted
                    ? 'linear-gradient(160deg, rgba(61,26,138,0.4) 0%, rgba(26,8,68,0.6) 100%)'
                    : 'linear-gradient(135deg, rgba(22,22,37,0.8) 0%, rgba(16,16,28,0.6) 100%)',
                  border: plan.highlighted
                    ? '1px solid rgba(201,168,76,0.4)'
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: plan.highlighted
                    ? '0 0 60px rgba(201,168,76,0.08), inset 0 0 40px rgba(61,26,138,0.1)'
                    : 'none',
                }}
              >
                {/* Recommended badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className="label-text text-[10px] px-4 py-1.5 tracking-widest"
                      style={{
                        background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                        color: 'var(--obsidian)',
                      }}
                    >
                      Empfohlen
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-8">
                  <p className="label-text tracking-[0.25em] text-[var(--gold)] text-[10px] mb-2">
                    {['I', 'II', 'III'][i]}. Grad
                  </p>
                  <h3
                    className="text-[var(--pearl)] font-bold"
                    style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-[var(--pearl-muted)] text-sm mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-bold ${plan.highlighted ? 'gradient-gold' : 'text-[var(--pearl)]'}`}
                      style={{ fontSize: '2.5rem', letterSpacing: '-0.03em' }}
                    >
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-[var(--pearl-muted)] text-sm">/Monat</span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-[var(--pearl-muted)] text-sm mt-1">
                      statt <span className="line-through">{formatPrice(plan.originalPrice)}</span>
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map((feature: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-[var(--pearl-dim)]">
                      <span style={{ color: plan.highlighted ? 'var(--gold)' : 'rgba(201,168,76,0.5)', flexShrink: 0 }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={ctaHref}>
                  <button
                    className="w-full py-4 font-semibold label-text tracking-widest transition-all duration-300"
                    style={
                      plan.highlighted
                        ? {
                            background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                            color: 'var(--obsidian)',
                          }
                        : {
                            border: '1px solid rgba(201,168,76,0.3)',
                            color: 'var(--gold)',
                            background: 'rgba(201,168,76,0.04)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!plan.highlighted) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!plan.highlighted) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
                      }
                    }}
                  >
                    {plan.ctaLabel}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="scroll-reveal opacity-0 transition-all duration-700 delay-500 text-center text-[var(--pearl-muted)] text-xs mt-10">
          Keine versteckten Kosten · Jederzeit kündbar · Sofortiger Zugang
        </p>
      </div>

      <style>{`
        .scroll-reveal.in-view { opacity: 1 !important; transform: translate(0,0) !important; }
      `}</style>
    </section>
  );
}
