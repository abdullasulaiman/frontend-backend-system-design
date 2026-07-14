import { useEffect, useState } from 'react';

const THEME_KEY = 'gfsd:v1:theme';

type Theme = 'light' | 'dark';

function readCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/**
 * Flips `data-theme` on `<html>`, persists the choice, and notifies the rest
 * of the app (e.g. the Mermaid island, which re-renders diagrams on theme
 * change) via a `gfsd:theme` `CustomEvent`.
 *
 * Initial state is read from the DOM in a `useEffect` (not at render time)
 * so this stays SSR-safe: the `<html data-theme>` attribute is already
 * correct before hydration thanks to the no-flash inline script in
 * `BaseLayout.astro`, and this component simply mirrors it once mounted.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(readCurrentTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore (private mode / storage disabled) */
    }
    window.dispatchEvent(new CustomEvent('gfsd:theme'));
    setTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-[var(--border)] bg-[var(--surface)] text-base text-[var(--text)] transition-colors duration-[var(--transition-fast)] hover:bg-[var(--surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  );
}
