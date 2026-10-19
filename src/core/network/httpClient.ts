export interface RequestContext { url: string; init: RequestInit }
export type RequestInterceptor = (ctx: RequestContext) => RequestContext | Promise<RequestContext>;
/** `retry` re-sends the original request (running the request interceptors again). */
export type ResponseInterceptor = (res: Response, retry: () => Promise<Response>) => Response | Promise<Response>;

interface Interceptors { request?: RequestInterceptor[]; response?: ResponseInterceptor[] }

/** Minimal fetch wrapper: request interceptors run before sending, response interceptors after. */
export const createHttpClient = (baseUrl: string, { request = [], response = [] }: Interceptors = {}) => {
  const root = baseUrl.replace(/\/$/, '');

  return async (path: string, init: RequestInit = {}): Promise<Response> => {
    const send = async () => {
      let ctx: RequestContext = { url: `${root}${path}`, init };
      for (const intercept of request) ctx = await intercept(ctx);
      return fetch(ctx.url, ctx.init);
    };
    let res = await send();
    for (const intercept of response) res = await intercept(res, send);
    return res;
  };
};

export type HttpClient = ReturnType<typeof createHttpClient>;
