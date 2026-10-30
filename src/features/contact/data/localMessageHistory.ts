import type { SentMessage } from '@/features/contact/model/messageHistory';

const KEY = 'contact.messageHistory';
const MAX_ENTRIES = 20;

const valid = (m: unknown): m is SentMessage => {
  const x = m as SentMessage;
  return !!x && typeof x.id === 'string' && (x.status === 'sent' || x.status === 'failed') && typeof x.message === 'string';
};

/** Message history in this browser's localStorage (newest first). Storage problems never break the form. */
export const localMessageHistory = {
  load(): SentMessage[] {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      return Array.isArray(raw) ? raw.filter(valid) : [];
    } catch {
      return [];
    }
  },
  save(items: SentMessage[]) {
    try {
      localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ENTRIES)));
    } catch {
      /* private mode or quota: history just isn't kept */
    }
  },
};
