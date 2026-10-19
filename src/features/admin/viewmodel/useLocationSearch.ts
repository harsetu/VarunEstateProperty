import { useEffect, useState } from 'react';
import type { GeoPlace } from '@/features/admin/model/place';
import { locationSearch } from '@/app/container';
import { t } from '@/core/utils/i18n';

const MIN_CHARS = 3;
const DELAY_MS = 600; // Nominatim asks for ~1 request per second at most

/** Debounced place search for the location picker. */
export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const text = query.trim();
    if (text.length < MIN_CHARS) {
      setResults([]); setError(null); setSearched(false); setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    const id = setTimeout(() => {
      setLoading(true);
      setError(null);
      locationSearch.search(text, ctrl.signal)
        .then((r) => { setResults(r); setSearched(true); })
        .catch((e: unknown) => { if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : t('error.generic')); })
        .finally(() => { if (!ctrl.signal.aborted) setLoading(false); });
    }, DELAY_MS);
    return () => { clearTimeout(id); ctrl.abort(); };
  }, [query]);

  const reset = () => { setQuery(''); setResults([]); setSearched(false); };
  return { query, setQuery, results, loading, error, searched, reset };
}
