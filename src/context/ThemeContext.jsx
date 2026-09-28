// src/context/ThemeContext.jsx

import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, THEMES } from '../utils/constants';

export const ThemeContext = createContext(null);

/**
 * Provedor de tema (light/dark).
 * Respeita prefers-color-scheme na primeira visita.
 * Aplica data-theme no documentElement.
 */
export function ThemeProvider({ children }) {
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useLocalStorage(
    STORAGE_KEYS.THEME,
    prefersDark ? THEMES.DARK : THEMES.LIGHT
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
