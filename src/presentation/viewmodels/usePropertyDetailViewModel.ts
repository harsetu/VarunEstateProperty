import { useEffect, useState } from 'react';
import type { NearbyPlace, Property } from '@/domain/property';
import { propertyRepository } from '@/app/container';
import { relatedProperties } from '@/domain/propertyRules';
import { useCatalog } from '@/presentation/CatalogProvider';
import type { LoadStatus } from '@/presentation/CatalogProvider';

/** Loads one listing plus its nearby places; related listings come from the shared catalog. */
export function usePropertyDetailViewModel(id: string | undefined) {
  const { properties } = useCatalog();
  const [state, setState] = useState<{ status: LoadStatus; property?: Property; nearby: NearbyPlace[] }>({
    status: 'loading',
    nearby: [],
  });

  useEffect(() => {
    if (!id) return setState({ status: 'ready', nearby: [] });
    let cancelled = false;
    setState({ status: 'loading', nearby: [] });
    (async () => {
      const property = await propertyRepository.getById(id);
      const nearby = property ? await propertyRepository.getNearby(property) : [];
      if (!cancelled) setState({ status: 'ready', property, nearby });
    })().catch(() => !cancelled && setState({ status: 'error', nearby: [] }));
    return () => { cancelled = true; };
  }, [id]);

  const related = state.property ? relatedProperties(properties, state.property) : [];
  return { ...state, related };
}
