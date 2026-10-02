import { useState } from 'react';
import { CalendarCheck, CheckCircle2 } from 'lucide-react';
import Modal, { fieldClass, labelClass } from '@/components/Modal';
import { normalizePhone, whatsappLink } from '@/data/contact';
import type { Property } from '@/data/properties';

const SLOTS = ['Morning (10 AM – 12 PM)', 'Afternoon (12 – 4 PM)', 'Evening (4 – 7 PM)'];

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
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (!cleanPhone) return setError('Please enter a valid 10-digit mobile number.');
    if (!date || date < today) return setError('Please pick today or a later date.');
    setError('');

    const prettyDate = new Date(`${date}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const message = [
      'Site visit request',
      `Property: ${property.title} (${property.sector})`,
      `Name: ${name.trim()}`,
      `Phone: +91 ${cleanPhone}`,
      `Date: ${prettyDate}`,
      `Time: ${slot}`,
      note.trim() && `Note: ${note.trim()}`,
      `Link: ${window.location.href}`,
    ].filter(Boolean).join('\n');

    window.open(whatsappLink(message), '_blank', 'noopener');
    try { sessionStorage.setItem('ve-lead', '1'); } catch { /* storage blocked */ }
    setSent(true);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={sent ? 'Request sent!' : 'Schedule a site visit'}
      subtitle={sent ? undefined : `${property.title} · ${property.sector}`}
    >
      {sent ? (
        <div className="text-center py-4">
          <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-4" />
          <p className="text-ash leading-relaxed">
            We've opened WhatsApp with your visit details — just press <b className="text-fg">Send</b>.
            Our team will confirm your slot shortly.
          </p>
          <button onClick={close} className="neopop-btn mt-6">Done</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className={labelClass} htmlFor="sv-name">Your name</label>
            <input id="sv-name" className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoComplete="name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="sv-phone">Mobile number</label>
            <input id="sv-phone" className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" inputMode="tel" autoComplete="tel" />
          </div>
          <div>
            <label className={labelClass} htmlFor="sv-date">Preferred date</label>
            <input id="sv-date" type="date" className={fieldClass} value={date} min={today} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <span className={labelClass}>Preferred time</span>
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
            <label className={labelClass} htmlFor="sv-note">Anything we should know? <span className="text-ash-dark font-normal">(optional)</span></label>
            <textarea id="sv-note" rows={2} className={fieldClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. coming with family, need parking" />
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <button type="submit" className="neopop-btn w-full !bg-gold !border-gold hover:!bg-gold-dark">
            <CalendarCheck size={17} /> Confirm visit request
          </button>
          <p className="text-xs text-ash-dark text-center">Free site visit · No obligation · We'll call to confirm</p>
        </form>
      )}
    </Modal>
  );
}
