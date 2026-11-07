import type { ContactQuery, ContactRepository } from '@/features/contact/repository/ContactRepository';

/** Sends an enquiry through every channel at once (email, WhatsApp). It counts as sent if at least one gets through. */
export class CompositeContactRepository implements ContactRepository {
  constructor(private readonly channels: ContactRepository[]) {}

  async send(query: ContactQuery) {
    const results = await Promise.allSettled(this.channels.map((c) => c.send(query)));
    if (results.every((r) => r.status === 'rejected')) throw (results[0] as PromiseRejectedResult).reason;
  }
}
