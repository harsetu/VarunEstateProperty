import { pageOf } from '@/features/properties/model/propertyRules';
import type { NewProject, Property } from '@/features/properties/model/property';
import { createHttpClient, type HttpClient } from '@/core/network/httpClient';
import { acceptJson, staticHeaders } from '@/core/network/interceptors';
import type { PropertyPage, PropertyQuery, PropertyRepository } from '@/features/properties/repository/PropertyRepository';
import {
  fromDetail, fromSummary,
  type PageDto, type PropertyDetailDto, type PropertySummaryDto,
} from '@/features/properties/data/propertyMapper';

const PAGE_SIZE = 50; // server maximum
const MAX_PAGES = 20;

/**
 * Public, read-only access to the backend:
 *   GET /properties?page=&size=  -> paged PropertySummary (cover image only)
 *   GET /properties/:id          -> PropertyDetail (all images, amenities, nearby…)
 */
export class ApiPropertyRepository implements PropertyRepository {
  private readonly http: HttpClient;

  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    this.http = createHttpClient(baseUrl, { request: [acceptJson, staticHeaders(headers)] });
  }

  private async get<T>(path: string): Promise<T | undefined> {
    const res = await this.http(path);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`Request failed (${res.status}) for ${path}`);
    return res.json() as Promise<T>;
  }

  private page = (page: number, size: number, listingType?: string) => {
    const qs = new URLSearchParams({ page: String(page), size: String(size) });
    if (listingType) qs.set('listingType', listingType);
    return this.get<PageDto<PropertySummaryDto>>(`/properties?${qs}`);
  };

  private fetchAll = async (listingType?: string): Promise<Property[]> => {
    const all: Property[] = [];
    for (let page = 0; page < MAX_PAGES; page++) {
      const res = await this.page(page, PAGE_SIZE, listingType);
      if (!res) break;
      all.push(...res.content.map(fromSummary));
      if (page + 1 >= res.totalPages) break;
    }
    return all;
  };

  getAll = () => this.fetchAll();

  /**
   * The server pages and filters by listing type only. When the query also needs a property type,
   * location, label or price sort, every (listing-type filtered) page is fetched and filtered/paged here.
   */
  search = async (q: PropertyQuery): Promise<PropertyPage> => {
    const listingType = q.purpose === 'Sale' ? 'SELL' : q.purpose === 'Rent' ? 'RENT' : undefined;
    if (q.type !== 'All' || q.sector !== 'All' || q.label !== 'All' || q.sort !== 'recommended') return pageOf(await this.fetchAll(listingType), q);
    const res = await this.page(q.page - 1, q.size, listingType);
    const totalPages = Math.max(1, res?.totalPages ?? 1);
    return { items: (res?.content ?? []).map(fromSummary), total: res?.totalElements ?? 0, page: q.page, totalPages };
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
