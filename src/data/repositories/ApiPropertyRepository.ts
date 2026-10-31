import type { NewProject, Property } from '@/domain/property';
import type { PropertyRepository } from '@/domain/repositories/PropertyRepository';
import {
  fromDetail, fromSummary,
  type PageDto, type PropertyDetailDto, type PropertySummaryDto,
} from '@/data/api/propertyMapper';

const PAGE_SIZE = 50; // server maximum
const MAX_PAGES = 20;

/**
 * Public, read-only access to the backend:
 *   GET /properties?page=&size=  -> paged PropertySummary (cover image only)
 *   GET /properties/:id          -> PropertyDetail (all images, amenities, nearby…)
 */
export class ApiPropertyRepository implements PropertyRepository {
  constructor(private readonly baseUrl: string, private readonly headers: Record<string, string> = {}) {}

  private async get<T>(path: string): Promise<T | undefined> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, '')}${path}`, {
      headers: { Accept: 'application/json', ...this.headers },
    });
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`Request failed (${res.status}) for ${path}`);
    return res.json() as Promise<T>;
  }

  getAll = async (): Promise<Property[]> => {
    const all: Property[] = [];
    for (let page = 0; page < MAX_PAGES; page++) {
      const res = await this.get<PageDto<PropertySummaryDto>>(`/properties?page=${page}&size=${PAGE_SIZE}`);
      if (!res) break;
      all.push(...res.content.map(fromSummary));
      if (page + 1 >= res.totalPages) break;
    }
    return all;
  };

  getById = async (id: string) => {
    const dto = await this.get<PropertyDetailDto>(`/properties/${encodeURIComponent(id)}`);
    return dto && fromDetail(dto);
  };

  // Nearby places arrive with the detail response
  getNearby = async (p: Property) => p.nearby ?? [];

  // No projects endpoint on the backend; never let it break the page
  getNewProjects = async (): Promise<NewProject[]> => [];
}
