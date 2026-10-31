import { useCallback, useEffect, useState } from 'react';
import type { Dashboard } from '@/features/admin/model/admin';
import { dashboardRepository } from '@/app/container';
import { t } from '@/core/utils/i18n';
import { formatPriceRange } from '@/core/utils/pricing';

export type DashboardStatus = 'loading' | 'ready' | 'error';

const formatPrice = (price: number | null | undefined, priceMax: number | null | undefined, currency?: string | null) =>
  price == null ? t('price.onRequest') : formatPriceRange(price, priceMax, currency);
const titleCase = (s?: string | null) => !s ? '' : s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ');

/** Totals and recent properties from GET /api/dashboard. */
export function useAdminDashboardViewModel() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [status, setStatus] = useState<DashboardStatus>('loading');
  const [error, setError] = useState<string>();

  const load = useCallback(() => {
    if (!dashboardRepository) return;
    setStatus('loading');
    dashboardRepository.get()
      .then((d) => { setData(d); setStatus('ready'); })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : t('dashboard.loadFailed')); setStatus('error'); });
  }, []);

  useEffect(load, [load]);

  return {
    status, error, reload: load,
    totals: data && { total: data.totalProperties, forSale: data.totalForSale, forRent: data.totalForRent },
    recent: (data?.recentProperties ?? []).map((p) => ({
      id: p.id,
      title: p.propertyName,
      image: p.coverImage,
      place: [p.location, p.city].filter(Boolean).join(', '),
      price: formatPrice(p.price, p.priceMax, p.currency),
      listing: titleCase(p.listingType),
      category: titleCase(p.propertyCategory),
      area: p.areaValue ? `${p.areaValue.toLocaleString('en-IN')} ${(p.areaUnit ?? '').toLowerCase()}` : '',
      beds: p.bedrooms,
      baths: p.bathrooms,
    })),
  };
}
