import { adminSession } from '@/core/network/session';
import { errorMessage, toSession, type TokenResponse } from '@/core/network/tokens';
import { t } from '@/core/utils/i18n';
import type { RequestInterceptor, ResponseInterceptor } from '@/core/network/httpClient';

const withHeaders = (headers: Record<string, string>): RequestInterceptor => (ctx) => ({
  ...ctx,
  init: { ...ctx.init, headers: { ...headers, ...(ctx.init.headers as Record<string, string> | undefined) } },
});

export const acceptJson = withHeaders({ Accept: 'application/json' });
export const staticHeaders = withHeaders;

/** Adds `Authorization: Bearer <accessToken>` while an admin is signed in. */
export const bearerAuth: RequestInterceptor = (ctx) => {
  const token = adminSession.get()?.accessToken;
  return token ? withHeaders({ Authorization: `Bearer ${token}` })(ctx) : ctx;
};

// One refresh at a time: parallel 401s share the same call (refresh tokens may be single-use)
let inFlight: Promise<boolean> | null = null;

/** POST /auth/refresh and store the new tokens. Resolves false if the server rejected the refresh token. */
const refreshTokens = (apiRoot: string, refreshToken: string): Promise<boolean> =>
  (inFlight ??= (async () => {
    try {
      const res = await fetch(`${apiRoot}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const body = (await res.json()) as TokenResponse;
      const current = adminSession.get();
      if (!body.accessToken || !current) return false;
      adminSession.set({
        ...toSession(body, current.user.username),
        // keep the old refresh token if the server doesn't rotate it
        refreshToken: body.refreshToken ?? current.refreshToken,
        user: body.user?.username ? toSession(body, current.user.username).user : current.user,
      });
      return true;
    } finally {
      queueMicrotask(() => { inFlight = null; });
    }
  })());

/** On a 401: get a new access token and replay the request once; if that still fails, sign the admin out. */
export const refreshOn401 = (apiRoot: string): ResponseInterceptor => async (res, retry) => {
  if (res.status !== 401) return res;
  const session = adminSession.get();
  if (!session) return res; // not signed in: let throwOnError report it
  let renewed = false;
  if (session.refreshToken) {
    try {
      renewed = await refreshTokens(apiRoot, session.refreshToken);
    } catch {
      throw new Error(t('login.unreachable')); // network problem: keep the session
    }
  }
  if (renewed) {
    const second = await retry();
    if (second.status !== 401) return second;
  }
  adminSession.set(null);
  throw new Error(t('api.sessionExpired'));
};

/** Turns any non-2xx response into an Error carrying the server's message. */
export const throwOnError: ResponseInterceptor = async (res) => {
  if (!res.ok) throw new Error(await errorMessage(res, t('api.requestFailed', { status: res.status })));
  return res;
};
