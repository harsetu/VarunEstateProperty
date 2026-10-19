import { createHttpClient } from '@/core/network/httpClient';
import { acceptJson, bearerAuth, refreshOn401, throwOnError } from '@/core/network/interceptors';

/** HTTP client for admin endpoints: bearer token, refresh-and-retry on 401, readable errors. */
export const createAuthorizedFetch = (apiRoot: string) =>
  createHttpClient(apiRoot, {
    request: [acceptJson, bearerAuth],
    response: [refreshOn401(apiRoot), throwOnError],
  });
