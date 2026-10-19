import { t } from '@/core/utils/i18n';
import flavor from '@/flavors';
import { Phone, Mail, MapPin, Send, Check } from 'lucide-react';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { useContactViewModel } from '@/features/contact/viewmodel/useContactViewModel';
import { CONTACT, mapEmbedUrl } from '@/core/config/contact';

export default function Contact() {
  const { form, change, submitted, sending, error, submit: handleSubmit } = useContactViewModel();

  const inputClass = 'w-full mt-1.5 bg-ink-900 border border-fg/15 rounded-lg text-fg placeholder-ash-dark px-4 py-3 focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none transition';

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      <section className="relative overflow-hidden bg-night py-24 lg:py-32 px-6 text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full bg-gold/20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 pointer-events-none" />
        <ScrollReveal className="relative">
          <p className="text-gold-light text-sm font-bold uppercase tracking-[0.2em] mb-5">{t('contact.eyebrow')}</p>
          <h1 className="font-display font-bold uppercase text-white text-[clamp(2rem,5.5vw,4rem)] tracking-wide">
            {t('contact.title')} <span className="font-script not-italic font-normal text-gold-light text-[1.3em] leading-none normal-case">{t('contact.titleEm')}</span>
          </h1>
        </ScrollReveal>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <ScrollReveal>
              <h2 className="font-display font-light text-fg text-3xl lg:text-5xl mb-6">
                {t('contact.talk')} <span className="font-script not-italic font-normal text-gold-dark text-[1.25em] leading-none">{t('contact.talkEm')}</span>
              </h2>
              <p className="text-ash-light leading-relaxed mb-12 max-w-md">
                {t('contact.intro', { market: flavor.market })}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-ash text-xs font-bold uppercase tracking-wider mb-1">{t('contact.office')}</p>
                    <p className="text-fg">{CONTACT.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-ash text-xs font-bold uppercase tracking-wider mb-1">{t('contact.phone')}</p>
                    <span className="flex flex-col">
                      {CONTACT.phones.map((ph) => (
                        <a key={ph.href} href={ph.href} className="text-fg hover:text-gold transition-colors">{ph.display}</a>
                      ))}
                    </span>
                    <p className="text-ash text-sm mt-1">{CONTACT.person}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-ash text-xs font-bold uppercase tracking-wider mb-1">{t('contact.email')}</p>
                    <a href={`mailto:${CONTACT.email}`} className="text-fg hover:text-gold transition-colors break-all">{CONTACT.email}</a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 h-64 rounded-lg bg-ink-700 border border-fg/10 overflow-hidden">
                <iframe
                  src={mapEmbedUrl(CONTACT.mapQuery)}
                  className="w-full h-full"
                  loading="lazy"
                  title={t('contact.mapTitle')}
                />
              </div>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal delay={0.1}>
              <div className="bg-white border border-fg/10 rounded-lg shadow-card p-8 lg:p-12">
                <h3 className="font-display font-light text-fg text-3xl mb-8">
                  {t('contact.send')} <span className="font-script not-italic font-normal text-gold-dark text-[1.25em] leading-none">{t('contact.sendEm')}</span>
                </h3>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-4">
                      <Check size={32} className="text-fg" />
                    </div>
                    <p className="text-fg text-lg font-semibold">{t('contact.sent')}</p>
                    <p className="text-ash text-sm mt-2">{t('contact.sentBody')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="text-ash text-xs font-bold uppercase tracking-wider">{t('contact.name')}</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => change({ name: e.target.value })}
                        className={inputClass}
                        placeholder={t('contact.namePh')}
                      />
                    </div>
                    <div>
                      <label className="text-ash text-xs font-bold uppercase tracking-wider">{t('contact.email')}</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => change({ email: e.target.value })}
                        className={inputClass}
                        placeholder={t('contact.emailPh')}
                      />
                    </div>
                    <div>
                      <label className="text-ash text-xs font-bold uppercase tracking-wider">{t('contact.phone')}</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => change({ phone: e.target.value })}
                        className={inputClass}
                        placeholder={t('contact.phonePh')}
                      />
                    </div>
                    <div>
                      <label className="text-ash text-xs font-bold uppercase tracking-wider">{t('contact.message')}</label>
                      <textarea
                        required
                        value={form.message}
                        onChange={(e) => change({ message: e.target.value })}
                        className={inputClass + ' resize-none'}
                        placeholder={t('contact.messagePh')}
                        rows={4}
                      />
                    </div>
                    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={sending} className="neopop-btn !rounded-lg w-full flex items-center justify-center gap-2 disabled:opacity-60" data-cursor="hover">
                      <Send size={16} /> {sending ? t('contact.sending') : t('contact.submit')}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
