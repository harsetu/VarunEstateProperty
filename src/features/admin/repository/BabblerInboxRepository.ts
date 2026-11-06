import type { InboxRepository } from '@/features/admin/repository/AdminRepositories';
import { extractList, oldestFirst, toConversation, toMessage, type Conversation, type ConversationPage, type MessagePage } from '@/features/admin/model/inbox';
import { HttpError } from '@/core/network/tokens';

const PAGE_SIZE = 25;
/** Third-party chat service (Babbler); `baseUrl` is VITE_BABBLER_BASE_URL and its API key goes in a request header. */

export class BabblerInboxRepository implements InboxRepository {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly keyHeader: string,
  ) {}

  private get = async (path: string, params: Record<string, string | number | boolean>): Promise<unknown> => {
    const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
    const res = await fetch(`${this.baseUrl}${path}?${qs}`, {
      headers: { Accept: 'application/json, text/plain, */*', [this.keyHeader]: this.apiKey },
    });
    if (!res.ok) {
      let message = `Inbox request failed (${res.status}).`;
      try { message = ((await res.json()) as { message?: string }).message || message; } catch { /* keep default */ }
      throw new HttpError(message, res.status);
    }
    return res.json();
  };

  conversations = async (page: number): Promise<ConversationPage> => {
    const body = await this.get('/chat/active/contact', {
      page, page_size: PAGE_SIZE, sort_order: 'desc', archive_status: 'active', unified_inbox: true,
    });
    const items = extractList(body).map(toConversation).filter((c) => c.id);
    return { items, hasMore: items.length >= PAGE_SIZE };
  };

  /** GET /chat?contact_id=…&page=…&page_size=…&phone_no_id=… -> { page, page_size, chat: [...] } */
  history = async (contact: Conversation, page: number): Promise<MessagePage> => {
    const body = await this.get('/chat', {
      contact_id: contact.id, page, page_size: PAGE_SIZE, ...(contact.phoneNoId ? { phone_no_id: contact.phoneNoId } : {}),
    });
    const raw = extractList(body);
    return { items: oldestFirst(raw.map(toMessage)), hasMore: raw.length >= PAGE_SIZE };
  };
}
