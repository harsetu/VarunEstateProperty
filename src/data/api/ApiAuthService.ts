import type { AdminUser, AuthService } from '@/domain/repositories/AdminRepositories';
import { adminSession } from './adminSession';
import { errorMessage, toSession, type TokenResponse } from './tokens';
import { t } from '@/i18n';

/**
 * POST {api}/auth/login   { identifier, password } -> TokenResponse { accessToken, refreshToken, user }
 * POST {api}/auth/refresh { refreshToken }         -> TokenResponse
 * Only ADMIN / SUPER_ADMIN accounts receive tokens.
 */
export class ApiAuthService implements AuthService {
  constructor(private readonly apiRoot: string) {}

  async getUser(): Promise<AdminUser | null> {
    return adminSession.get()?.user ?? null;
  }

  async signIn(identifier: string, password: string) {
    const id = identifier.trim();
    let res: Response;
    try {
      res = await fetch(`${this.apiRoot}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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
