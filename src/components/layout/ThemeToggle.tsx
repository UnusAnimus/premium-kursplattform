'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

type ThemeToggleProps = {
  className?: string;
  iconSize?: number;
};

export function ThemeToggle({ className = '', iconSize = 18 }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all duration-200 ${className}`}
      aria-label="Theme wechseln"
      title={isDark ? 'Zu hellem Modus wechseln' : 'Zu dunklem Modus wechseln'}
      type="button"
    >
      {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
    </button>
  );
}