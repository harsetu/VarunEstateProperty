import type { Review, ReviewInput } from '@/features/reviews/model/review';
import type { ReviewRepository } from '@/features/reviews/repository/ReviewRepository';
import { createHttpClient, type HttpClient } from '@/core/network/httpClient';
import { acceptJson, throwOnError } from '@/core/network/interceptors';
import { createAuthorizedFetch } from '@/core/network/authorizedFetch';

/**
 * GET    {api}/reviews/public       -> Review[]            (no login)
 * GET    {api}/reviews              -> Review[]            (admin)
 * POST   {api}/reviews              ReviewInput -> 201 Review
 * PUT    {api}/reviews/:id          ReviewInput -> Review  (404 REVIEW_NOT_FOUND)
 * DELETE {api}/reviews/:id          -> 204                 (404 REVIEW_NOT_FOUND)
 */
export class ApiReviewRepository implements ReviewRepository {
  private readonly open: HttpClient;
  private readonly send: ReturnType<typeof createAuthorizedFetch>;

  constructor(apiRoot: string) {
    this.open = createHttpClient(apiRoot, { request: [acceptJson], response: [throwOnError] });
    this.send = createAuthorizedFetch(apiRoot);
  }

  private json = (method: string, path: string, body: ReviewInput) =>
    this.send(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  listPublic = async () => (await (await this.open('/reviews/public')).json()) as Review[];
  list = async () => (await (await this.send('/reviews')).json()) as Review[];
  create = async (input: ReviewInput) => (await (await this.json('POST', '/reviews', input)).json()) as Review;
  update = async (id: number, input: ReviewInput) => (await (await this.json('PUT', `/reviews/${id}`, input)).json()) as Review;
  remove = async (id: number) => void (await this.send(`/reviews/${id}`, { method: 'DELETE' }));
}
