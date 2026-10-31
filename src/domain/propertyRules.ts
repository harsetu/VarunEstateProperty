import type { Property, PropertyType, Purpose } from './property';
import { formatINR } from './pricing';

export type SortKey = 'recommended' | 'price-asc' | 'price-desc';

export interface PropertyFilter {
  type?: PropertyType | 'All' | string;
  sector?: string;
  purpose?: Purpose | 'All' | string;
}

const featuredFirst = (a: Property, b: Property) => Number(b.featured) - Number(a.featured);

export const sortProperties = (list: Property[], sort: SortKey = 'recommended') => {
  if (sort === 'price-asc') return [...list].sort((a, b) => a.priceValue - b.priceValue);
  if (sort === 'price-desc') return [...list].sort((a, b) => b.priceValue - a.priceValue);
  return [...list].sort(featuredFirst);
};

export const filterProperties = (list: Property[], { type = 'All', sector = 'All', purpose = 'All' }: PropertyFilter) =>
  list.filter((p) =>
    (type === 'All' || p.type === type) &&
    (sector === 'All' || p.sector === sector) &&
    (purpose === 'All' || p.purpose === purpose),
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
  const priced = sale.length ? sale : list;
  return priced.length ? formatINR(Math.min(...priced.map((p) => p.priceValue))) : null;
};
