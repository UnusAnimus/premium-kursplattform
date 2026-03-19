import Link from 'next/link';
import type { PricingPlan } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <div className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
      plan.highlighted
        ? 'bg-violet-900/20 border-2 border-violet-500 shadow-[0_0_40px_rgba(124,58,237,0.25)]'
        : 'bg-[#13131a] border border-[#1e1e2e] hover:border-violet-500/50'
    }`}>
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
            ✦ Empfohlen
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-violet-300' : 'text-white'}`}>
          {plan.name}
        </h3>
        <p className="text-slate-400 text-sm">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{formatPrice(plan.price)}</span>
          <span className="text-slate-400 text-sm">/Monat</span>
        </div>
        {plan.originalPrice && (
          <p className="text-slate-500 text-sm mt-1">
            statt <span className="line-through">{formatPrice(plan.originalPrice)}</span>
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 ${plan.highlighted ? 'text-violet-400' : 'text-emerald-400'}`}>✓</span>
            <span className="text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/login"
        className={`w-full text-center font-semibold py-3.5 rounded-xl transition-all ${
          plan.highlighted
            ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-500/30'
            : 'border border-[#2a2a3e] hover:border-violet-500 text-slate-300 hover:text-white'
        }`}
      >
        {plan.ctaLabel}
      </Link>
    </div>
  );
}
