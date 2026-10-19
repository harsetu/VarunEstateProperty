import type { GeoPlace } from '@/features/admin/model/place';

export interface LocationSearchRepository {
  search(query: string, signal?: AbortSignal): Promise<GeoPlace[]>;
}
