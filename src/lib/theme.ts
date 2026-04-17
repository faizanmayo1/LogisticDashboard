import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'meridian.theme';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(KEY) as Theme | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.dataset.theme = theme;
  localStorage.setItem(KEY, theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => applyTheme(theme), [theme]);
  return {
    theme,
    setTheme,
    toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
  };
}
