import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'primary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Progress({ value, max = 100, label, showValue = false, variant = 'primary', size = 'md', className = '' }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    primary: 'bg-violet-500',
    accent: 'bg-amber-500',
    success: 'bg-emerald-500',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showValue && <span className="text-xs text-slate-400">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#1e1e2e] rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${variants[variant]} rounded-full transition-all duration-500 h-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
