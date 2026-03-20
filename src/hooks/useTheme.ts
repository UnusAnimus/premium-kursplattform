'use client';
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    const nextTheme: Theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : (mediaQuery.matches ? 'dark' : 'light');

    setTheme(nextTheme);
    applyTheme(nextTheme);

    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) {
        return;
      }

      const systemTheme: Theme = event.matches ? 'dark' : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return { isDark: theme === 'dark', theme, toggleTheme };
}

