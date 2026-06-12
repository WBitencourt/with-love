'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_THEME_ID, THEMES, ThemeConfig, ThemeId } from '@/lib/themes';

interface ThemeContextValue {
  currentTheme: ThemeConfig;
  setTheme: ({ id }: { id: ThemeId }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME_ID);

  useEffect(() => {
    const stored = localStorage.getItem('theme-id') as ThemeId | null;

    const resolved = stored && THEMES.some((t) => t.id === stored) ? stored : DEFAULT_THEME_ID;

    setThemeId(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  function setTheme({ id }: { id: ThemeId }) {
    setThemeId(id);
    localStorage.setItem('theme-id', id);
    document.documentElement.setAttribute('data-theme', id);
  }

  const currentTheme = THEMES.find((t) => t.id === themeId) ?? THEMES[THEMES.length - 1];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return ctx;
}
