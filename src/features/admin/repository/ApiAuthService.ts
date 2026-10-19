import type { AdminUser, AuthService } from '@/features/admin/repository/AdminRepositories';
import { createHttpClient, type HttpClient } from '@/core/network/httpClient';
import { acceptJson } from '@/core/network/interceptors';
import { adminSession } from '@/core/network/session';
import { errorMessage, toSession, type TokenResponse } from '@/core/network/tokens';
import { t } from '@/core/utils/i18n';

/**
 * POST {api}/auth/login   { identifier, password } -> TokenResponse { accessToken, refreshToken, user }
 * POST {api}/auth/refresh { refreshToken }         -> TokenResponse
 * Only ADMIN / SUPER_ADMIN accounts receive tokens.
 */
export class ApiAuthService implements AuthService {
  private readonly http: HttpClient;

  constructor(apiRoot: string) {
    this.http = createHttpClient(apiRoot, { request: [acceptJson] });
  }

  async getUser(): Promise<AdminUser | null> {
    return adminSession.get()?.user ?? null;
  }

  async signIn(identifier: string, password: string) {
    const id = identifier.trim();
    let res: Response;
    try {
      res = await this.http('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id, password }),
      });
    } catch {
      throw new Error(t('login.unreachable'));
    }
    if (!res.ok) throw new Error(await errorMessage(res, t('login.failedStatus', { status: res.status })));
    const body = (await res.json()) as TokenResponse;
    if (!body.accessToken) throw new Error(t('login.noToken'));
    adminSession.set(toSession(body, id));
  }

  async signOut() {
    adminSession.set(null);
  }

  onChange = (listener: (user: AdminUser | null) => void) => adminSession.subscribe(listener);
}
