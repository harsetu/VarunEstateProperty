import { useEffect, useState, type FormEvent } from 'react';
import { analytics } from '@/core/analytics/analytics';
import { AnalyticsEvent } from '@/constants/analytics';
import { contactRepository } from '@/app/container';
import { localMessageHistory } from '@/features/contact/data/localMessageHistory';
import type { SentMessage } from '@/features/contact/model/messageHistory';
import type { ContactQuery } from '@/features/contact/repository/ContactRepository';
import { t } from '@/core/utils/i18n';

const EMPTY = { name: '', email: '', phone: '', message: '' };
const RESET_MS = 4000;

/** Sends one query and says how it went. Never throws. */
const attempt = async (query: ContactQuery): Promise<{ ok: true } | { ok: false; error: string }> => {
  try {
    if (!contactRepository) throw new Error(t('contact.notConnected'));
    await contactRepository.send(query);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : t('error.generic') };
  }
};

/** State of the contact form; the query is sent to the backend, and every attempt is kept in a local history. */
export function useContactViewModel() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [history, setHistory] = useState<SentMessage[]>(() => localMessageHistory.load());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const change = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  const commit = (update: (items: SentMessage[]) => SentMessage[]) =>
    setHistory((items) => {
      const next = update(items);
      localMessageHistory.save(next);
      return next;
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    const result = await attempt(form);
    commit((items) => [
      { ...form, id: crypto.randomUUID(), status: result.ok ? 'sent' : 'failed', error: result.ok ? undefined : result.error, at: new Date().toISOString() },
      ...items,
    ]);
    if (result.ok) {
      analytics.track(AnalyticsEvent.contactSubmit);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm(EMPTY);
      }, RESET_MS);
    } else {
      setError(result.error);
    }
    setSending(false);
  };

  /** Re-sends a failed message and updates its entry in place. */
  const retry = async (id: string) => {
    const item = history.find((m) => m.id === id);
    if (!item || retryingId) return;
    setRetryingId(id);
    const result = await attempt({ name: item.name, email: item.email, phone: item.phone, message: item.message });
    if (result.ok) analytics.track(AnalyticsEvent.contactSubmit);
    commit((items) =>
      items.map((m) => (m.id === id ? { ...m, status: result.ok ? 'sent' : 'failed', error: result.ok ? undefined : result.error, at: new Date().toISOString() } : m)),
    );
    setRetryingId(null);
  };

  const remove = (id: string) => commit((items) => items.filter((m) => m.id !== id));
  const clearHistory = () => commit(() => []);

  return { form, change, submitted, sending, error, submit, history, retry, retryingId, remove, clearHistory };
}
