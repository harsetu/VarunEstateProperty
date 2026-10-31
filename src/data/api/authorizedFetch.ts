import { adminSession } from './adminSession';
import { errorMessage, toSession, type TokenResponse } from './tokens';
import { t } from '@/i18n';

/**
 * fetch for admin endpoints: adds `Authorization: Bearer <accessToken>`, retries once after
 * POST {api}/auth/refresh on a 401, signs the admin out if that fails, and throws readable errors.
 */
export const createAuthorizedFetch = (apiRoot: string) => {
  const refresh = async (): Promise<boolean> => {
    const session = adminSession.get();
    if (!session?.refreshToken) return false;
    try {
      const res = await fetch(`${apiRoot}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
      if (!res.ok) return false;
      const body = (await res.json()) as TokenResponse;
      adminSession.set({ ...toSession(body, session.user.username), user: session.user });
      return true;
    } catch {
      return false;
    }
  };

  const request = (path: string, init: RequestInit) => {
    const token = adminSession.get()?.accessToken;
    return fetch(`${apiRoot}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
    });
  };

  return async (path: string, init: RequestInit = {}): Promise<Response> => {
    let res = await request(path, init);
    if (res.status === 401 && (await refresh())) res = await request(path, init);
    if (res.status === 401) {
      adminSession.set(null);
      throw new Error(t('api.sessionExpired'));
    }
    if (!res.ok) throw new Error(await errorMessage(res, t('api.requestFailed', { status: res.status })));
    return res;
  };
};
