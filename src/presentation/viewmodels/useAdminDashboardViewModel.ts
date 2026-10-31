import { useCallback, useEffect, useState } from 'react';
import type { Dashboard } from '@/domain/note';
import { dashboardRepository, notesRepository } from '@/app/container';
import { t } from '@/i18n';

export type DashboardStatus = 'loading' | 'ready' | 'error';

const formatPrice = (price: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString('en-IN')}`;
  }
};
const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ');

/** Totals and recent properties from GET /api/dashboard. */
export function useAdminDashboardViewModel() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [status, setStatus] = useState<DashboardStatus>('loading');
  const [error, setError] = useState<string>();
  const [notes, setNotes] = useState(0);

  const load = useCallback(() => {
    if (!dashboardRepository) return;
    setStatus('loading');
    dashboardRepository.get()
      .then((d) => { setData(d); setStatus('ready'); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : t('dashboard.loadFailed')); setStatus('error'); });
  }, []);

  useEffect(load, [load]);
  useEffect(() => { notesRepository.list().then((n) => setNotes(n.length)); }, []);

  return {
    status, error, reload: load, notes,
    totals: data && { total: data.totalProperties, forSale: data.totalForSale, forRent: data.totalForRent },
    recent: (data?.recentProperties ?? []).map((p) => ({
      id: p.id,
      title: p.propertyName,
      image: p.coverImage,
      place: [p.location, p.city].filter(Boolean).join(', '),
      price: formatPrice(p.price, p.currency),
      listing: titleCase(p.listingType),
      category: titleCase(p.propertyCategory),
      area: p.areaValue ? `${p.areaValue.toLocaleString('en-IN')} ${p.areaUnit.toLowerCase()}` : '',
      beds: p.bedrooms,
      baths: p.bathrooms,
    })),
  };
}
