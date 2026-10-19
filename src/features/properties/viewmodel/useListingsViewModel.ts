import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog, type LoadStatus } from '@/features/properties/viewmodel/CatalogProvider';
import { LABELS, type Property } from '@/features/properties/model/property';
import type { SortKey } from '@/features/properties/repository/PropertyRepository';
import { PURPOSES, TYPES } from '@/features/properties/data/propertyOptions';
import { propertyRepository } from '@/app/container';
import { t } from '@/core/utils/i18n';

export const PAGE_SIZE = 20;

export const SORT_LABELS = {
  recommended: t('listings.sortRecommended'),
  'price-asc': t('listings.sortAsc'),
  'price-desc': t('listings.sortDesc'),
} as const;

interface Results { items: Property[]; total: number; totalPages: number }

/** Filter/sort/page state for the listings page. It lives in the URL, and every change runs a new listing query. */
export function useListingsViewModel() {
  const { sectors } = useCatalog();
  const [params, setParams] = useSearchParams();

  const pick = (key: string, options: readonly string[], fallback: string) => {
    const v = params.get(key);
    return v && options.includes(v) ? v : fallback;
  };
  const type = pick('type', TYPES, 'All');
  const sector = params.get('sector') || 'All';
  const purpose = pick('purpose', PURPOSES, 'All');
  const label = pick('label', LABELS, 'All');
  const sort = pick('sort', Object.keys(SORT_LABELS), 'recommended') as SortKey;
  const requestedPage = Math.max(1, parseInt(params.get('page') ?? '', 10) || 1);

  const [state, setState] = useState<{ status: LoadStatus; error?: string; results: Results }>({
    status: 'loading',
    results: { items: [], total: 0, totalPages: 1 },
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading', error: undefined }));
    propertyRepository
      .search({ purpose, type, sector, label, sort, page: requestedPage, size: PAGE_SIZE })
      .then((r) => !cancelled && setState({ status: 'ready', results: { items: r.items, total: r.total, totalPages: r.totalPages } }))
      .catch((e: unknown) =>
        !cancelled && setState((s) => ({ ...s, status: 'error', error: e instanceof Error ? e.message : t('error.generic') })),
      );
    return () => { cancelled = true; };
  }, [purpose, type, sector, label, sort, requestedPage, attempt]);

  const setFilter = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    next.delete('page'); // a new filter starts from the first page
    setParams(next, { replace: true });
  };
  const setPage = (page: number) => {
    const next = new URLSearchParams(params);
    if (page <= 1) next.delete('page');
    else next.set('page', String(page));
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const clearAll = () => setParams(new URLSearchParams(), { replace: true });
  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const { items, total, totalPages } = state.results;
  return {
    status: state.status, error: state.error, reload,
    sectors: ['All', ...sectors], type, sector, purpose, label, sort,
    results: items, total, page: Math.min(requestedPage, totalPages), totalPages,
    setFilter, setPage, clearAll,
  };
}
