import type { ThemeRepository } from '@/features/admin/repository/AdminRepositories';
import { normalizeTheme, type ThemeId } from '@/core/theme/themes';
import { createHttpClient } from '@/core/network/httpClient';
import { acceptJson } from '@/core/network/interceptors';
import { createAuthorizedFetch } from '@/core/network/authorizedFetch';

/** GET {api}/theme (public) -> { theme, available, updatedAt };  PUT {api}/theme { theme } (admin only) */
export class ApiThemeRepository implements ThemeRepository {
  private readonly publicGet = createHttpClient(this.apiRoot, { request: [acceptJson] });
  private readonly send: ReturnType<typeof createAuthorizedFetch>;

  constructor(private readonly apiRoot: string) {
    this.send = createAuthorizedFetch(apiRoot);
  }

  get = async (): Promise<ThemeId> => {
    const res = await this.publicGet('/theme');
    if (!res.ok) throw new Error(`theme ${res.status}`);
    return normalizeTheme(((await res.json()) as { theme?: string }).theme);
  };

  update = async (theme: ThemeId): Promise<ThemeId> => {
    const res = await this.send('/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme }),
    });
    return normalizeTheme(((await res.json()) as { theme?: string }).theme);
  };
}
