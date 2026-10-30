import type { NearbyPlace, NewProject, Property } from '@/features/properties/model/property';

export type SortKey = 'recommended' | 'price-asc' | 'price-desc';

/** Listings page query. `page` is 1-based; 'All' means no filter on that field. */
export interface PropertyQuery {
  purpose: string;
  type: string;
  /** 'Residential' (everything but Commercial), 'Commercial', 'Investment' (new launches), or 'All'. */
  segment: string;
  sector: string;
  /** A listing label such as NEW_LAUNCH, or 'All'. */
  label: string;
  sort: SortKey;
  page: number;
  size: number;
}

export interface PropertyPage {
  items: Property[];
  total: number;
  page: number;
  totalPages: number;
}

/** Contract the app depends on. Implementations live in the data layer. */
export interface PropertyRepository {
  getAll(): Promise<Property[]>;
  /** One page of listings matching the query (runs a fresh query each call). */
  search(query: PropertyQuery): Promise<PropertyPage>;
  getById(id: string): Promise<Property | undefined>;
  getNearby(property: Property): Promise<NearbyPlace[]>;
  getNewProjects(): Promise<NewProject[]>;
}
