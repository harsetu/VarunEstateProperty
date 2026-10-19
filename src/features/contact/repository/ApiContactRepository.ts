import type { ContactQuery, ContactRepository } from '@/features/contact/repository/ContactRepository';
import { createHttpClient, type HttpClient } from '@/core/network/httpClient';
import { acceptJson, throwOnError } from '@/core/network/interceptors';
import { t } from '@/core/utils/i18n';

/** Public endpoint, no login: POST {api}/contact { name, phoneNumber, emailId, message } */
export class ApiContactRepository implements ContactRepository {
  private readonly http: HttpClient;

  constructor(apiRoot: string) {
    this.http = createHttpClient(apiRoot, { request: [acceptJson], response: [throwOnError] });
  }

  async send({ name, phone, email, message }: ContactQuery) {
    try {
      await this.http('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phoneNumber: phone.trim(), emailId: email.trim(), message: message.trim() }),
      });
    } catch (e) {
      // fetch rejects with a TypeError when the server can't be reached
      throw e instanceof TypeError ? new Error(t('login.unreachable')) : e;
    }
  }
}
