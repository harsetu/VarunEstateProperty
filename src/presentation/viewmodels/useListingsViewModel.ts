import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '@/presentation/CatalogProvider';
import { filterProperties, sortProperties, type SortKey } from '@/domain/propertyRules';
import { PURPOSES, TYPES } from '@/data/properties';
import { t } from '@/i18n';

export const SORT_LABELS = {
  recommended: t('listings.sortRecommended'),
  'price-asc': t('listings.sortAsc'),
  'price-desc': t('listings.sortDesc'),
} as const;

/** Filter/sort state for the listings page. Filters live in the URL so results can be shared. */
export function useListingsViewModel() {
  const { status, error, reload, properties, sectors } = useCatalog();
  const [params, setParams] = useSearchParams();

  const pick = (key: string, options: readonly string[], fallback: string) => {
    const v = params.get(key);
    return v && options.includes(v) ? v : fallback;
  };
  const type = pick('type', TYPES, 'All');
  const sector = pick('sector', ['All', ...sectors], 'All');
  const purpose = pick('purpose', PURPOSES, 'All');
  const sort = pick('sort', Object.keys(SORT_LABELS), 'recommended') as SortKey;

  const setFilter = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const results = useMemo(
    () => sortProperties(filterProperties(properties, { type, sector, purpose }), sort),
    [properties, type, sector, purpose, sort],
  );

  return { status, error, reload, sectors: ['All', ...sectors], type, sector, purpose, sort, results, setFilter, clearAll };
}
