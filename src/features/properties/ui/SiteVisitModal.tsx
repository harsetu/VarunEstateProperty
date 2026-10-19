import { useState } from 'react';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import Modal, { fieldClass, labelClass } from '@/core/widgets/Modal';
import { whatsappLink } from '@/core/config/contact';
import { normalizePhone } from '@/core/utils/phone';
import type { Property } from '@/features/properties/model/property';
import { t } from '@/core/utils/i18n';
import { AnalyticsEvent } from '@/constants/analytics';
import { analytics } from '@/core/analytics/analytics';

const SLOTS = [t('visit.slotMorning'), t('visit.slotAfternoon'), t('visit.slotEvening')];

const toISODate = (d: Date) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

interface SiteVisitModalProps {
  open: boolean;
  onClose: () => void;
  property: Property;
}

export default function SiteVisitModal({ open, onClose, property }: SiteVisitModalProps) {
  const today = toISODate(new Date());
  const tomorrow = toISODate(new Date(Date.now() + 86400000));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(tomorrow);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => {
    onClose();
    setTimeout(() => { setSent(false); setError(''); }, 300);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = normalizePhone(phone);
    if (name.trim().length < 2) return setError(t('visit.errName'));
    if (!cleanPhone) return setError(t('visit.errPhone'));
    if (!date || date < today) return setError(t('visit.errDate'));
    setError('');

    const prettyDate = new Date(`${date}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const message = [
      t('visit.msgTitle'),
      t('visit.msgProperty', { title: property.title, sector: property.sector }),
      t('visit.msgName', { name: name.trim() }),
      t('visit.msgPhone', { phone: cleanPhone }),
      t('visit.msgDate', { date: prettyDate }),
      t('visit.msgTime', { time: slot }),
      note.trim() && t('visit.msgNote', { note: note.trim() }),
      t('visit.msgLink', { url: window.location.href }),
    ].filter(Boolean).join('\n');

    window.open(whatsappLink(message), '_blank', 'noopener');
    try { sessionStorage.setItem('ve-lead', '1'); } catch { /* storage blocked */ }
    analytics.track(AnalyticsEvent.siteVisitRequest, { property: property.id });
    setSent(true);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={sent ? t('visit.sentTitle') : t('visit.title')}
      subtitle={sent ? undefined : `${property.title} · ${property.sector}`}
    >
      {sent ? (
        <div className="text-center py-4">
          <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-4" />
          <p className="text-ash leading-relaxed">
            {t('visit.sentBody1')} <b className="text-fg">{t('visit.send')}</b>.{' '}
            {t('visit.sentBody2')}
          </p>
          <button onClick={close} className="neopop-btn mt-6">{t('visit.done')}</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className={labelClass} htmlFor="sv-name">{t('visit.nameLabel')}</label>
            <input id="sv-name" className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('visit.namePlaceholder')} autoComplete="name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="sv-phone">{t('visit.phoneLabel')}</label>
            <input id="sv-phone" className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('visit.phonePlaceholder')} inputMode="tel" autoComplete="tel" />
          </div>
          <div>
            <label className={labelClass} htmlFor="sv-date">{t('visit.dateLabel')}</label>
            <input id="sv-date" type="date" className={fieldClass} value={date} min={today} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <span className={labelClass}>{t('visit.timeLabel')}</span>
            <div className="grid grid-cols-1 gap-2">
              {SLOTS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                    slot === s ? 'border-gold bg-gold/10 text-fg font-medium' : 'border-fg/15 text-ash hover:border-fg/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="sv-note">{t('visit.noteLabel')} <span className="text-ash-dark font-normal">{t('visit.optional')}</span></label>
            <textarea id="sv-note" rows={2} className={fieldClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('visit.notePlaceholder')} />
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <button type="submit" className="neopop-btn w-full !bg-gold !border-gold hover:!bg-gold-dark">
            <CalendarCheck size={17} /> {t('visit.confirm')}
          </button>
          <p className="text-xs text-ash-dark text-center">{t('visit.footnote')}</p>
        </form>
      )}
    </Modal>
  );
}
