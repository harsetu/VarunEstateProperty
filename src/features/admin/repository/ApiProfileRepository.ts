import type { Profile } from '@/features/admin/model/admin';
import type { ProfileRepository } from '@/features/admin/repository/AdminRepositories';
import { createAuthorizedFetch } from '@/core/network/authorizedFetch';

/** GET {api}/profile -> ProfileResponse;  PUT {api}/profile (UpdateProfileRequest) -> ProfileResponse;
 *  POST {api}/profile/change-password { currentPassword, newPassword } */
export class ApiProfileRepository implements ProfileRepository {
  private readonly send: ReturnType<typeof createAuthorizedFetch>;

  constructor(apiRoot: string) {
    this.send = createAuthorizedFetch(apiRoot);
  }

  get = async () => (await this.send('/profile')).json() as Promise<Profile>;

  update = async (p: Profile) => {
    const { username, name, email, countryCode, mobileNumber } = p;
    const res = await this.send('/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, name, email, countryCode, mobileNumber }),
    });
    return res.json() as Promise<Profile>;
  };

  changePassword = async (currentPassword: string, newPassword: string) => {
    await this.send('/profile/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  };
}
