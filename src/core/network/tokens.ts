import type { Session } from '@/core/network/session';

/** Shape of the backend's TokenResponse. */
export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  user?: { username?: string; name?: string };
}

export const toSession = (t: TokenResponse, fallbackUsername: string): Session => ({
  accessToken: t.accessToken,
  refreshToken: t.refreshToken,
  user: { username: t.user?.username ?? fallbackUsername, name: t.user?.name },
});

/** The backend reports errors as { code, message }. */
/** An error from a non-2xx response, keeping the status so callers can tell 403 from the rest. */
export class HttpError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export const errorMessage = async (res: Response, fallback: string) => {
  try {
    const body = (await res.json()) as { message?: string };
    return body.message || fallback;
  } catch {
    return fallback;
  }
};
