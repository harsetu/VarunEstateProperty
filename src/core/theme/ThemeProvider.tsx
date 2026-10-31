import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { themeRepository } from '@/app/container';
import { applyTheme, cacheTheme, cachedTheme, DEFAULT_THEME, THEME_EVENT, type ThemeId } from '@/core/theme/themes';

const ThemeContext = createContext<ThemeId>(DEFAULT_THEME);

/** The site theme in effect (THEME1 on admin pages). Lets pages swap layout pieces, e.g. the home banner. */
export const useTheme = () => useContext(ThemeContext);

/**
 * Applies the site-wide theme to <html>. The cached theme is already set before first paint (see index.html);
 * this fetches the current one from GET /theme and updates. The admin panel keeps its own default look.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const admin = pathname.startsWith('/admin');
  const [theme, setTheme] = useState<ThemeId>(cachedTheme);

  useEffect(() => {
    if (admin) return applyTheme(null);
    applyTheme(theme);
  }, [admin, theme]);

  useEffect(() => {
    const sync = () => setTheme(cachedTheme());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    themeRepository?.get()
      .then((next) => {
        if (cancelled) return;
        cacheTheme(next);
        setTheme(next);
      })
      .catch(() => { /* keep the cached theme (or THEME1) */ });
    return () => { cancelled = true; };
  }, []);

  return <ThemeContext.Provider value={admin ? DEFAULT_THEME : theme}>{children}</ThemeContext.Provider>;
}
