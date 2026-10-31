export const THEME_IDS = ['THEME1', 'THEME2', 'THEME3'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME: ThemeId = 'THEME1';
const STORAGE_KEY = 'site-theme';
/** Fired when the theme is cached, so a mounted ThemeProvider picks up a change made in the admin panel. */
export const THEME_EVENT = 'site-theme-changed';

/** Unknown or missing names fall back to the default theme. */
export const normalizeTheme = (value: unknown): ThemeId =>
  THEME_IDS.includes(value as ThemeId) ? (value as ThemeId) : DEFAULT_THEME;

export const THEME_LABELS: Record<ThemeId, { name: string; blurb: string }> = {
  THEME1: { name: 'Style1', blurb: 'Warm cream with gold accents' },
  THEME2: { name: 'Style2', blurb: 'Video banner, clean sans-serif look' },
  THEME3: { name: 'Style3', blurb: 'Image carousel banner, serif headings' },
};

export const cachedTheme = (): ThemeId => {
  try {
    return normalizeTheme(localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
};

export const cacheTheme = (theme: ThemeId) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable: the API value is used next time */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
};

/** Sets or clears `data-theme` on <html>. Clearing leaves the default (THEME1) palette from :root. */
export const applyTheme = (theme: ThemeId | null) => {
  const root = document.documentElement;
  if (theme) root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
};

/** Reads a colour token (e.g. '--c-fg') as an `rgb(r, g, b)` string for libraries that can't use CSS variables. */
export const cssColor = (token: string) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return `rgb(${raw.split(/\s+/).join(', ')})`;
};
