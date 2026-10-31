import type { Dashboard } from '@/domain/note';
import type { DashboardRepository } from '@/domain/repositories/AdminRepositories';
import { createAuthorizedFetch } from './authorizedFetch';

/** GET {api}/dashboard -> { totalProperties, totalForRent, totalForSale, recentProperties[] } (admin only) */
export class ApiDashboardRepository implements DashboardRepository {
  private readonly send: ReturnType<typeof createAuthorizedFetch>;

  constructor(apiRoot: string) {
    this.send = createAuthorizedFetch(apiRoot);
  }

  get = async () => {
    const d = (await (await this.send('/dashboard')).json()) as Partial<Dashboard>;
    return {
      totalProperties: d.totalProperties ?? 0,
      totalForRent: d.totalForRent ?? 0,
      totalForSale: d.totalForSale ?? 0,
      recentProperties: d.recentProperties ?? [],
    };
  };
}
