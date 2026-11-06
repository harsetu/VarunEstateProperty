export interface Conversation {
  id: string;
  name: string;
  phone?: string;
  lastMessage?: string;
  lastAt?: string;
  unread: number;
  channel?: string;
  /** The business number the chat runs on; the history call needs it. */
  phoneNoId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  at?: string;
  /** 'out' = sent by us, 'in' = sent by the customer. */
  direction: 'in' | 'out';
}

export interface ConversationPage {
  items: Conversation[];
  hasMore: boolean;
}

export interface MessagePage {
  /** Oldest first. */
  items: ChatMessage[];
  hasMore: boolean;
}

type Raw = Record<string, unknown>;

const pick = (o: Raw, keys: string[]): unknown => keys.map((k) => o[k]).find((v) => v !== undefined && v !== null && v !== '');
const str = (v: unknown): string | undefined => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : undefined);

/** A message field may be plain text or an object like { text } / { body }. */
const textOf = (v: unknown): string | undefined => {
  if (typeof v === 'object' && v !== null) return str(pick(v as Raw, ['text', 'body', 'content', 'message', 'message_text']));
  return str(v);
};

/** The list may be the body itself or sit under data / items / contacts / results (sometimes nested twice). */
export const extractList = (body: unknown): Raw[] => {
  if (Array.isArray(body)) return body as Raw[];
  if (typeof body !== 'object' || body === null) return [];
  const o = body as Raw;
  for (const key of ['data', 'items', 'contacts', 'results', 'messages', 'chats', 'chat']) {
    const inner = o[key];
    if (Array.isArray(inner)) return inner as Raw[];
    if (typeof inner === 'object' && inner !== null) {
      const deeper = extractList(inner);
      if (deeper.length) return deeper;
    }
  }
  return [];
};

export const toConversation = (r: Raw): Conversation => {
  const phone = str(pick(r, ['phone', 'phone_number', 'partner_phone_no', 'mobile', 'wa_id', 'contact_number']));
  return {
    id: str(pick(r, ['id', 'contact_id', '_id', 'chat_id', 'uuid'])) ?? phone ?? '',
    name: str(pick(r, ['name', 'contact_name', 'display_name', 'full_name', 'profile_name'])) ?? phone ?? '—',
    phone,
    lastMessage: textOf(pick(r, ['last_message', 'latest_message', 'last_message_text', 'last_message_body'])),
    lastAt: str(pick(r, ['last_message_at', 'last_message_time', 'last_message_timestamp', 'updated_at', 'last_active_at', 'timestamp'])),
    unread: Number(pick(r, ['unread_count', 'unread', 'unread_messages']) ?? 0) || 0,
    channel: str(pick(r, ['channel', 'platform', 'source', 'channel_type'])),
    phoneNoId: str(pick(r, ['phone_no_id', 'phone_number_id'])),
  };
};

/** A message is { type, body } (text) or another type such as image / document, shown as "[image]" with its caption. */
export const toMessage = (r: Raw, i: number): ChatMessage => {
  const dir = str(pick(r, ['msg_direction', 'direction', 'message_direction', 'sender_type', 'sender', 'role']))?.toLowerCase();
  const out = r.from_me === true || r.is_outgoing === true || (!!dir && ['out', 'outbound', 'outgoing', 'agent', 'business', 'bot', 'assistant', 'user_sent'].includes(dir));
  const m = typeof r.message === 'object' && r.message !== null ? (r.message as Raw) : undefined;
  const type = str(m?.type);
  const text = m
    ? str(pick(m, ['body', 'text', 'caption'])) ?? (type && type !== 'text' ? `[${type}]` : '')
    : textOf(pick(r, ['text', 'body', 'content', 'message', 'message_text'])) ?? '';
  return {
    id: str(pick(r, ['_id', 'id', 'chat_id', 'message_id'])) ?? String(i),
    text,
    at: str(pick(r, ['created_at', 'timestamp', 'sent_at', 'updated_at', 'time', 'date'])),
    direction: out ? 'out' : 'in',
  };
};

const timeOf = (m: ChatMessage): number => {
  if (!m.at) return NaN;
  const n = Number(m.at);
  return Number.isFinite(n) ? (n < 1e12 ? n * 1000 : n) : new Date(m.at).getTime();
};

/** Oldest first. Sorted by time when messages carry one, otherwise the API is assumed to list newest first. */
export const oldestFirst = (list: ChatMessage[]): ChatMessage[] =>
  list.length > 1 && list.every((m) => !Number.isNaN(timeOf(m)))
    ? [...list].sort((a, b) => timeOf(a) - timeOf(b))
    : [...list].reverse();

/** "3:45 PM" for today, otherwise "5 Nov". Accepts ISO strings or epoch seconds/milliseconds. */
export const formatInboxTime = (value?: string): string => {
  if (!value) return '';
  const n = Number(value);
  const d = new Date(Number.isFinite(n) && value.trim() !== '' ? (n < 1e12 ? n * 1000 : n) : value);
  if (Number.isNaN(d.getTime())) return '';
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};
