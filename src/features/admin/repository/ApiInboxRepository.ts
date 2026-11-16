import type { InboxRepository } from '@/features/admin/repository/AdminRepositories';
import { extractList, oldestFirst, toConversation, toMessage, type Conversation, type ConversationPage, type MessagePage } from '@/features/admin/model/inbox';
import { createAuthorizedFetch } from '@/core/network/authorizedFetch';

const PAGE_SIZE = 25;

/**
 * Inbox through our own backend, which relays the chat service (the admin's login token is used, so no key lives in the site):
 * GET {api}/babbler/chat/active/contact -> { status, message, data: { page, total_pages, data: [contacts] } }
 */
export class ApiInboxRepository implements InboxRepository {
  private readonly send: ReturnType<typeof createAuthorizedFetch>;

  constructor(apiRoot: string) {
    this.send = createAuthorizedFetch(apiRoot);
  }

  private get = async (path: string, params: Record<string, string | number | boolean>): Promise<unknown> => {
    const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
    return (await this.send(`${path}?${qs}`)).json();
  };

  conversations = async (page: number): Promise<ConversationPage> => {
    const body = await this.get('/babbler/chat/active/contact', {
      page, page_size: PAGE_SIZE, sort_order: 'desc', archive_status: 'active', unified_inbox: true,
    });
    const items = extractList(body).map(toConversation).filter((c) => c.id);
    const totalPages = Number((body as { data?: { total_pages?: number } })?.data?.total_pages);
    return { items, hasMore: Number.isFinite(totalPages) && totalPages > 0 ? page < totalPages : items.length >= PAGE_SIZE };
  };

  /** PATCH {api}/babbler/message/mark-read?babbler_message_id=…&show_typing_indicator=false */
  markRead = async (messageId: string): Promise<void> => {
    const qs = new URLSearchParams({ babbler_message_id: messageId, show_typing_indicator: 'false' });
    await this.send(`/babbler/message/mark-read?${qs}`, { method: 'PATCH' });
  };

  /** GET {api}/babbler/chat?contact_id=…&phone_no_id=…&page=…&page_size=… — both ids must come from the same contact in the list (else 404). */
  history = async (contact: Conversation, page: number): Promise<MessagePage> => {
    const body = await this.get('/babbler/chat', {
      contact_id: contact.id, page, page_size: PAGE_SIZE, ...(contact.phoneNoId ? { phone_no_id: contact.phoneNoId } : {}),
    });
    const raw = extractList(body);
    return { items: oldestFirst(raw.map(toMessage)), hasMore: raw.length >= PAGE_SIZE };
  };
}
