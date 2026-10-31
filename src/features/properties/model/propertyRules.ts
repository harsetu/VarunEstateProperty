import type { Label, NewProject, Property, PropertyType, Purpose } from '@/features/properties/model/property';
import { formatINR } from '@/core/utils/pricing';

export type { SortKey } from '@/features/properties/repository/PropertyRepository';
import type { PropertyPage, PropertyQuery, SortKey } from '@/features/properties/repository/PropertyRepository';

export interface PropertyFilter {
  type?: PropertyType | 'All' | string;
  sector?: string;
  purpose?: Purpose | 'All' | string;
  label?: string;
}

const featuredFirst = (a: Property, b: Property) => Number(b.featured) - Number(a.featured);

export const sortProperties = (list: Property[], sort: SortKey = 'recommended') => {
  if (sort === 'price-asc') return [...list].sort((a, b) => a.priceValue - b.priceValue);
  if (sort === 'price-desc') return [...list].sort((a, b) => b.priceValue - a.priceValue);
  return [...list].sort(featuredFirst);
};

export const filterProperties = (list: Property[], { type = 'All', sector = 'All', purpose = 'All', label = 'All' }: PropertyFilter) =>
  list.filter((p) =>
    (type === 'All' || p.type === type) &&
    (sector === 'All' || p.sector === sector) &&
    (purpose === 'All' || p.purpose === purpose) &&
    (label === 'All' || (p.labels ?? []).some((l) => l === label)),
  );

// Distinct locations, most listings first (ties alphabetical)
export const uniqueSectors = (list: Property[]) => {
  const counts = new Map<string, number>();
  list.forEach((p) => p.sector && counts.set(p.sector, (counts.get(p.sector) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name]) => name);
};

export const groupBySector = (list: Property[]) => {
  const map = new Map<string, Property[]>();
  list.forEach((p) => map.set(p.sector, [...(map.get(p.sector) ?? []), p]));
  return map;
};

// Same type first, then same sector, so there are usually three suggestions
export const relatedProperties = (list: Property[], property: Property, limit = 3) =>
  list
    .filter((p) => p.id !== property.id)
    .map((p) => ({ p, score: (p.type === property.type ? 2 : 0) + (p.sector === property.sector ? 1 : 0) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);

// Cheapest sale price; falls back to rent if there are only rentals
export const startingPrice = (list: Property[]) => {
  const sale = list.filter((p) => p.purpose === 'Sale');
  const priced = (sale.length ? sale : list).filter((p) => p.priceValue > 0);
  return priced.length ? formatINR(Math.min(...priced.map((p) => p.priceValue))) : null;
};

/** Filter, sort and slice a full list into one page (used when the server can't do it). */
export const pageOf = (list: Property[], { purpose, type, segment, sector, label, sort, page, size }: PropertyQuery): PropertyPage => {
  const inSegment = segment === 'Investment' ? (p: Property) => !!p.labels?.includes('NEW_LAUNCH') : segment === 'Commercial' ? (p: Property) => p.type === 'Commercial' : segment === 'Residential' ? (p: Property) => p.type !== 'Commercial' : () => true;
  const matches = sortProperties(filterProperties(list, { purpose, type, sector, label }).filter(inSegment), sort);
  const totalPages = Math.max(1, Math.ceil(matches.length / size));
  const current = Math.min(Math.max(1, page), totalPages);
  return { items: matches.slice((current - 1) * size, current * size), total: matches.length, page: current, totalPages };
};

/** Listings the admin tagged with `label`, shaped as projects for the project cards. */
export const projectsWithLabel = (list: Property[], label: Label): NewProject[] =>
  list
    .filter((p) => p.labels?.includes(label))
    .map((p) => ({
      id: p.id,
      name: p.title,
      developer: '',
      location: p.sector,
      status: 'Pre-Launch' as const,
      possession: '',
      configurations: p.type,
      sizeRange: p.area,
      startingPrice: p.price,
      image: p.images[0] ?? '',
      images: p.images,
      highlights: [...(p.usps ?? []), ...p.amenities].slice(0, 4),
    }));

export const newLaunchProjects = (list: Property[]) => projectsWithLabel(list, 'NEW_LAUNCH');
