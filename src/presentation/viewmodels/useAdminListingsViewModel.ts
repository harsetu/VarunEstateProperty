import { useMemo, useState } from 'react';
import { useCatalog } from '@/presentation/CatalogProvider';
import flavor from '@/flavors';

/** Searchable, filterable list of every listing for the admin. */
export function useAdminListingsViewModel() {
  const { properties, status, error, reload, sectors } = useCatalog();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [purpose, setPurpose] = useState('All');
  const [sector, setSector] = useState('All');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter(
      (p) =>
        (type === 'All' || p.type === type) &&
        (purpose === 'All' || p.purpose === purpose) &&
        (sector === 'All' || p.sector === sector) &&
        (!featuredOnly || p.featured) &&
        (!q || `${p.title} ${p.sector} ${p.area}`.toLowerCase().includes(q)),
    );
  }, [properties, query, type, purpose, sector, featuredOnly]);

  const filtersActive = Boolean(query) || type !== 'All' || purpose !== 'All' || sector !== 'All' || featuredOnly;
  const clear = () => { setQuery(''); setType('All'); setPurpose('All'); setSector('All'); setFeaturedOnly(false); };

  return {
    status, error, reload, results, total: properties.length, filtersActive, clear,
    query, setQuery, type, setType, purpose, setPurpose, sector, setSector, featuredOnly, setFeaturedOnly,
    types: flavor.content.types, sectors: ['All', ...sectors],
  };
}
