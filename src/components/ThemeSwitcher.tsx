'use client';

import { useEffect, useRef, useState } from 'react';
import { THEMES, ThemeId } from '@/lib/themes';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  function handleSelect({ id }: { id: ThemeId }) {
    setTheme({ id });
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="absolute top-3 right-3 z-30">
      <button
        onClick={handleToggle}
        className="px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-white"
        style={{ background: 'var(--theme-cta)' }}
        aria-label="Trocar tema"
      >
        {currentTheme.label}
      </button>

      {open && (
        <div
          className="absolute top-9 right-0 rounded-xl shadow-xl overflow-hidden min-w-[120px]"
          style={{ backgroundColor: 'var(--theme-paper-bg)', border: '1px solid var(--theme-timer-border)' }}
        >
          {THEMES.map((theme) => {
            const isActive = theme.id === currentTheme.id;

            return (
              <button
                key={theme.id}
                onClick={() => handleSelect({ id: theme.id })}
                className="w-full text-left px-4 py-2.5 text-xs font-medium transition-colors duration-150 cursor-pointer"
                style={{
                  color: isActive ? 'var(--theme-cta)' : 'var(--theme-text-primary)',
                  backgroundColor: isActive ? 'var(--theme-timer-bg)' : 'transparent',
                }}
              >
                {theme.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
