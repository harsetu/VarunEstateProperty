import { useEffect, useState, type FormEvent } from 'react';
import { analytics } from '@/core/analytics/analytics';
import { AnalyticsEvent } from '@/constants/analytics';
import { contactRepository } from '@/app/container';
import { t } from '@/core/utils/i18n';

const EMPTY = { name: '', email: '', phone: '', message: '' };
const RESET_MS = 4000;

/** State of the contact form; the query is sent to the backend when one is configured. */
export function useContactViewModel() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const change = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      await contactRepository?.send(form);
      analytics.track(AnalyticsEvent.contactSubmit);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm(EMPTY);
      }, RESET_MS);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.generic'));
    } finally {
      setSending(false);
    }
  };

  return { form, change, submitted, sending, error, submit };
}
