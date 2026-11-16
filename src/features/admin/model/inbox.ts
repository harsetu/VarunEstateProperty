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
  /** last_message_status: delivered / received (unread), read, meta_limit / failed (errors). */
  lastStatus?: string;
}

/** A chat is unread while its last message is only "delivered" or "received". */
export const isUnread = (c: Conversation): boolean =>
  c.lastStatus ? c.lastStatus === 'delivered' || c.lastStatus === 'received' : c.unread > 0;

export type MediaKind = 'image' | 'video' | 'audio' | 'document';

export interface ChatMessage {
  id: string;
  /** Text, or the caption of a file; for a template, its filled-in body. */
  text: string;
  at?: string;
  /** 'out' = sent by us, 'in' = sent by the customer. */
  direction: 'in' | 'out';
  media?: { kind: MediaKind; url: string; fileName?: string; mime?: string };
  /** Labels of a template's buttons. */
  buttons?: string[];
  /** Why WhatsApp did not deliver it, when it failed. */
  failure?: string;
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
    id: str(pick(r, ['contact_id', 'id', '_id', 'uuid'])) ?? phone ?? '',
    name: str(pick(r, ['name', 'contact_name', 'display_name', 'full_name', 'profile_name'])) ?? phone ?? '—',
    phone,
    lastMessage: textOf(pick(r, ['last_message', 'latest_message', 'last_message_text', 'last_message_body'])),
    lastAt: str(pick(r, ['last_message_at', 'last_message_time', 'last_message_timestamp', 'updated_at', 'last_active_at', 'timestamp'])),
    unread: Number(pick(r, ['unread_count', 'unread', 'unread_messages']) ?? 0) || 0,
    channel: str(pick(r, ['channel', 'platform', 'source', 'channel_type'])),
    phoneNoId: str(pick(r, ['phone_no_id', 'phone_number_id'])),
    lastStatus: str(pick(r, ['last_message_status']))?.toLowerCase(),
  };
};

const MEDIA_KINDS: Record<string, MediaKind> = { image: 'image', sticker: 'image', video: 'video', audio: 'audio', voice: 'audio', document: 'document' };
const asRaw = (v: unknown): Raw | undefined => (typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Raw) : undefined);
const asList = (v: unknown): Raw[] => (Array.isArray(v) ? (v.filter((x) => asRaw(x)) as Raw[]) : []);

/** A template's header file (image / video / document) as it was actually sent, else the example it was designed with. */
const templateHeader = (m: Raw, payload?: Raw): ChatMessage['media'] => {
  const sent = asList(payload?.components).find((c) => str(c.type)?.toUpperCase() === 'HEADER');
  const param = asList(sent?.parameters)[0];
  const type = str(param?.type)?.toLowerCase();
  if (param && type && MEDIA_KINDS[type]) {
    const url = str(asRaw(param[type])?.link);
    if (url) return { kind: MEDIA_KINDS[type], url, fileName: str(m.file_name) };
  }
  const header = asList(m.components).find((c) => str(c.type)?.toUpperCase() === 'HEADER');
  const kind = MEDIA_KINDS[str(header?.format)?.toLowerCase() ?? ''];
  const url = Array.isArray(asRaw(header?.example)?.header_handle) ? str((asRaw(header?.example)!.header_handle as unknown[])[0]) : undefined;
  return kind && url ? { kind, url, fileName: str(m.file_name) } : undefined;
};

/** Values for {{1}}, {{2}} …: what was actually sent, else the template's own example (body_text, flat or nested). */
const templateValues = (body: Raw | undefined, payload?: Raw): string[] => {
  const sent = asList(asList(payload?.components).find((c) => str(c.type)?.toUpperCase() === 'BODY')?.parameters).map((p) => str(p.text) ?? '');
  if (sent.some(Boolean)) return sent;
  const example = asRaw(body?.example)?.body_text;
  const list = Array.isArray(example) && Array.isArray(example[0]) ? example[0] : example;
  return Array.isArray(list) ? list.map((v) => str(v) ?? '') : [];
};

/** Template body with each {{n}} replaced by value n. */
const templateBody = (m: Raw, payload?: Raw): string => {
  const body = asList(m.components).find((c) => str(c.type)?.toUpperCase() === 'BODY');
  const values = templateValues(body, payload);
  return (str(body?.text) ?? '').replace(/\{\{(\d+)\}\}/g, (all, n: string) => values[Number(n) - 1] || all);
};

const templateButtons = (m: Raw): string[] =>
  asList(asList(m.components).find((c) => str(c.type)?.toUpperCase() === 'BUTTONS')?.buttons).map((b) => str(b.text) ?? '').filter(Boolean);

/** One chat message: text, a file (image / pdf / video / audio) with optional caption, or a template with its header file and buttons. */
export const toMessage = (r: Raw, i: number): ChatMessage => {
  const dir = str(pick(r, ['msg_direction', 'direction', 'message_direction', 'sender_type', 'sender', 'role']))?.toLowerCase();
  const out = r.from_me === true || r.is_outgoing === true || (!!dir && ['out', 'outbound', 'outgoing', 'agent', 'business', 'bot', 'assistant', 'user_sent'].includes(dir));
  const m = asRaw(r.message);
  const type = (str(m?.type) ?? str(r.message_type) ?? 'text').toLowerCase();
  const failed = asList(r.failure_reason)[0];
  const base = {
    id: str(pick(r, ['_id', 'id', 'chat_id', 'message_id'])) ?? String(i),
    at: str(pick(r, ['created_at', 'timestamp', 'sent_at', 'updated_at', 'time', 'date'])),
    direction: (out ? 'out' : 'in') as 'in' | 'out',
    failure: str(failed?.title) ?? str(failed?.message),
  };

  if (m && type === 'template') {
    const payload = asRaw(r.waba_template_payload);
    return { ...base, text: templateBody(m, payload), media: templateHeader(m, payload), buttons: templateButtons(m) };
  }
  if (m && MEDIA_KINDS[type]) {
    const url = str(m.media_url) ?? (typeof m.content === 'string' ? m.content : undefined);
    const caption = str(m.caption) ?? textOf(m.content && typeof m.content === 'object' ? m.content : undefined) ?? '';
    return {
      ...base,
      text: caption,
      media: url ? { kind: MEDIA_KINDS[type], url, fileName: str(m.filename) ?? str(r.file_name), mime: str(m.mime_type) } : undefined,
      ...(url ? {} : { text: caption || `[${type}]` }),
    };
  }
  const text = m
    ? textOf(pick(m, ['content', 'body', 'text', 'caption'])) ?? (type !== 'text' ? `[${type}]` : '')
    : textOf(pick(r, ['text', 'body', 'content', 'message', 'message_text'])) ?? '';
  return { ...base, text };
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
