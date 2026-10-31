import type { Property } from '@/domain/property';
import type { ListingAdminRepository } from '@/domain/repositories/AdminRepositories';
import flavor from '@/flavors';
import { createAuthorizedFetch } from './authorizedFetch';
import { toCreateRequest } from './propertyMapper';
import { t } from '@/i18n';

/**
 * POST   {api}/properties        CreatePropertyRequest -> 201 PropertyDetail      (exists on the backend)
 * PUT    {api}/properties/:id    CreatePropertyRequest -> 200                      (not on the backend yet)
 * DELETE {api}/properties/:id                          -> 204                      (not on the backend yet)
 * POST   {api}/images            multipart "file"      -> 201 { key, url, contentType, sizeBytes }
 *         (JPEG/PNG/WebP/GIF, max 5 MB; `url` is then used as the listing's imageUrl)
 * Website listings are converted to the server's format by propertyMapper.
 */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024;

export class ApiListingAdmin implements ListingAdminRepository {
  private readonly send: ReturnType<typeof createAuthorizedFetch>;

  constructor(apiRoot: string) {
    this.send = createAuthorizedFetch(apiRoot);
  }

  private json = (method: string, path: string, body: unknown) =>
    this.send(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  createProperty = async (p: Property) => void (await this.json('POST', '/properties', toCreateRequest(p, flavor.market)));
  updateProperty = async (p: Property) => void (await this.json('PUT', `/properties/${encodeURIComponent(p.id)}`, toCreateRequest(p, flavor.market)));
  deleteProperty = async (id: string) => void (await this.send(`/properties/${encodeURIComponent(id)}`, { method: 'DELETE' }));

  async uploadImage(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error(t('api.uploadType', { name: file.name }));
    if (file.size > MAX_BYTES) throw new Error(t('api.uploadSize', { name: file.name }));
    const form = new FormData();
    form.append('file', file);
    const { url } = (await (await this.send('/images', { method: 'POST', body: form })).json()) as { url?: string };
    if (!url) throw new Error(t('api.uploadNoUrl'));
    // Relative URLs are served by the backend, not by this site
    return url.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''}${url}` : url;
  }
}
