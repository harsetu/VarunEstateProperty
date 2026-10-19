import { useMemo, useState } from 'react';
import type { Property } from '@/features/properties/model/property';
import { listingAdmin } from '@/app/container';
import { t } from '@/core/utils/i18n';
import { useCatalog } from '@/features/properties/viewmodel/CatalogProvider';
import flavor from '@/flavors';

/** Searchable, filterable list of every listing for the admin. */
export function useAdminListingsViewModel() {
  const { properties, status, error, reload, sectors } = useCatalog();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [purpose, setPurpose] = useState('All');
  const [sector, setSector] = useState('All');
  const [label, setLabel] = useState('All');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const askDelete = (p: Property) => { setDeleteError(null); setPendingDelete(p); };
  const cancelDelete = () => setPendingDelete(null);
  const confirmDelete = async () => {
    if (!pendingDelete || !listingAdmin) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await listingAdmin.deleteProperty(pendingDelete.id);
      setPendingDelete(null);
      setNotice(t('alist.deleted'));
      reload();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : t('error.generic'));
    } finally {
      setDeleting(false);
    }
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter(
      (p) =>
        (type === 'All' || p.type === type) &&
        (purpose === 'All' || p.purpose === purpose) &&
        (sector === 'All' || p.sector === sector) &&
        (label === 'All' || (p.labels ?? []).some((l) => l === label)) &&
        (!featuredOnly || p.featured) &&
        (!q || `${p.title} ${p.sector} ${p.area}`.toLowerCase().includes(q)),
    );
  }, [properties, query, type, purpose, sector, label, featuredOnly]);

  const filtersActive = Boolean(query) || type !== 'All' || purpose !== 'All' || sector !== 'All' || label !== 'All' || featuredOnly;
  const clear = () => { setQuery(''); setType('All'); setPurpose('All'); setSector('All'); setLabel('All'); setFeaturedOnly(false); };

  return {
    pendingDelete, deleting, deleteError, notice, askDelete, cancelDelete, confirmDelete,
    status, error, reload, results, total: properties.length, filtersActive, clear,
    query, setQuery, type, setType, purpose, setPurpose, sector, setSector, label, setLabel, featuredOnly, setFeaturedOnly,
    types: flavor.content.types, sectors: ['All', ...sectors],
  };
}
