'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { PricingPlan } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  const ctaHref = isLoggedIn
    ? isAdmin ? '/admin' : '/dashboard'
    : '/login';

  return (
    <div className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
      plan.highlighted
        ? 'bg-[var(--bg-surface-raised)] border-2 border-[var(--badge-brand-border)] shadow-[var(--shadow-glow)]'
        : 'bg-[var(--bg-surface)] border border-[var(--border-base)] hover:bg-[var(--bg-surface-hover)] hover:border-violet-500/40'
    }`}>
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="brand-chip text-xs font-bold px-4 py-1.5 rounded-full">
            ✦ Empfohlen
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-[var(--badge-brand-text)]' : 'text-[var(--text-primary)]'}`}>
          {plan.name}
        </h3>
        <p className="text-[var(--text-secondary)] text-sm">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[var(--text-primary)]">{formatPrice(plan.price)}</span>
          <span className="text-[var(--text-secondary)] text-sm">/Monat</span>
        </div>
        {plan.originalPrice && (
          <p className="text-[var(--text-muted)] text-sm mt-1">
            statt <span className="line-through">{formatPrice(plan.originalPrice)}</span>
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 ${plan.highlighted ? 'text-[var(--badge-brand-text)]' : 'text-emerald-500'}`}>✓</span>
            <span className="text-[var(--text-secondary)]">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`w-full text-center font-semibold py-3.5 rounded-xl transition-all ${
          plan.highlighted
            ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-500/30'
            : 'border border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] hover:border-violet-500 text-[var(--text-primary)]'
        }`}
      >
        {plan.ctaLabel}
      </Link>
    </div>
  );
}
