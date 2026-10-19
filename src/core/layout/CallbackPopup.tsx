import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PhoneCall, X, CheckCircle2 } from 'lucide-react';
import { fieldClass } from '@/core/widgets/Modal';
import { whatsappLink } from '@/core/config/contact';
import { normalizePhone } from '@/core/utils/phone';
import { t } from '@/core/utils/i18n';
import { AnalyticsEvent } from '@/constants/analytics';
import { analytics } from '@/core/analytics/analytics';

const SEEN_KEY = 've-callback-seen';
const LEAD_KEY = 've-lead';
const DELAY_MS = 35000;

const storage = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string) => { try { sessionStorage.setItem(k, '1'); } catch { /* storage blocked */ } },
};

// Small "we'll call you" card. Appears once per session after the visitor has
// browsed for a while, or when the mouse heads for the tab bar on desktop.
export default function CallbackPopup() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const blockedPage = location.pathname === '/contact';

  useEffect(() => {
    if (storage.get(SEEN_KEY) || storage.get(LEAD_KEY)) return;

    const show = () => {
      if (storage.get(SEEN_KEY) || storage.get(LEAD_KEY)) return;
      if (document.documentElement.classList.contains('is-loading')) return;
      if (window.location.pathname === '/contact') return;
      storage.set(SEEN_KEY);
      setOpen(true);
    };

    const timer = setTimeout(show, DELAY_MS);
    const armedAt = Date.now();
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && Date.now() - armedAt > 10000) show();
    };
    document.addEventListener('mouseout', onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  if (!open || blockedPage) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizePhone(phone);
    if (!clean) return setError(t('callback.invalidPhone'));
    setError('');
    const message = [
      t('callback.request'),
      name.trim() && t('callback.name', { name: name.trim() }),
      t('callback.phone', { phone: clean }),
      t('callback.viewing', { url: window.location.href }),
    ].filter(Boolean).join('\n');
    window.open(whatsappLink(message), '_blank', 'noopener');
    storage.set(LEAD_KEY);
    analytics.track(AnalyticsEvent.callbackRequest);
    setSent(true);
    setTimeout(() => setOpen(false), 5000);
  };

  return (
    <div className="fixed z-[6500] left-4 right-4 bottom-24 sm:left-auto sm:right-6 sm:w-[360px] animate-[cbIn_0.4s_cubic-bezier(0.22,1,0.36,1)]">
      <div className="relative rounded-2xl bg-white shadow-card-hover border border-fg/10 overflow-hidden">
        <div className="h-1 bg-gold" />
        <button onClick={() => setOpen(false)} aria-label={t('common.close')} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-ash hover:bg-ink-800 hover:text-fg">
          <X size={16} />
        </button>

        <div className="p-5">
          {sent ? (
            <div className="flex items-start gap-3 pr-6">
              <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
              <div>
                <p className="font-semibold text-fg">{t('callback.thanks')}</p>
                <p className="text-ash text-sm mt-1">{t('callback.thanksBody')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3 pr-6 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <p className="font-display font-semibold text-fg text-lg leading-tight">{t('callback.title')}</p>
                  <p className="text-ash text-sm mt-1">{t('callback.body')}</p>
                </div>
              </div>
              <form onSubmit={submit} className="space-y-2.5" noValidate>
                <input className={`${fieldClass} py-2.5`} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('callback.namePlaceholder')} autoComplete="name" aria-label={t('callback.nameLabel')} />
                <input className={`${fieldClass} py-2.5`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('callback.phonePlaceholder')} inputMode="tel" autoComplete="tel" aria-label={t('callback.phoneLabel')} />
                {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
                <button type="submit" className="neopop-btn w-full py-2.5">{t('callback.submit')}</button>
              </form>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes cbIn { from { opacity: 0; transform: translateY(20px) } }`}</style>
    </div>
  );
}
