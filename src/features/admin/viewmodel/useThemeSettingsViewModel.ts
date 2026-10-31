import { useEffect, useState } from 'react';
import { themeRepository } from '@/app/container';
import { HttpError } from '@/core/network/tokens';
import { cacheTheme, DEFAULT_THEME, type ThemeId } from '@/core/theme/themes';
import { t } from '@/core/utils/i18n';

type Message = { kind: 'ok' | 'error'; text: string };

const failure = (e: unknown) => {
  if (e instanceof HttpError) {
    if (e.status === 400) return t('theme.err400');
    if (e.status === 401) return t('theme.err401');
    if (e.status === 403) return t('theme.err403');
  }
  return e instanceof Error ? e.message : t('theme.saveFailed');
};

/** Current site theme (GET /theme) and saving a new one (PUT /theme). */
export function useThemeSettingsViewModel() {
  const [active, setActive] = useState<ThemeId>(DEFAULT_THEME);
  const [selected, setSelected] = useState<ThemeId>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    themeRepository?.get()
      .then((theme) => { setActive(theme); setSelected(theme); })
      .catch((e: unknown) => setMessage({ kind: 'error', text: e instanceof Error ? e.message : t('theme.loadFailed') }))
      .finally(() => setLoading(false));
  }, []);

  // The success toast clears itself
  useEffect(() => {
    if (message?.kind !== 'ok') return;
    const id = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(id);
  }, [message]);

  const save = async () => {
    if (!themeRepository || selected === active) return;
    setBusy(true);
    setMessage(null);
    try {
      const saved = await themeRepository.update(selected);
      setActive(saved);
      setSelected(saved);
      cacheTheme(saved);
      setMessage({ kind: 'ok', text: t('theme.updated') });
    } catch (e) {
      setMessage({ kind: 'error', text: failure(e) });
    } finally {
      setBusy(false);
    }
  };

  return { active, selected, setSelected, loading, busy, message, save, dirty: selected !== active };
}
