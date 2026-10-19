import { Link } from 'react-router-dom';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { CONTACT } from '@/core/config/contact';
import { useHomeContent } from '@/features/home/viewmodel/useHomeContent';
import { t } from '@/core/utils/i18n';
import flavor from '@/flavors';

export default function CtaFooter() {
  const { quoteVideo: QUOTE_VIDEO } = useHomeContent();
  return (
    <section className="pb-20 lg:pb-28 bg-ink-900">
      <ScrollReveal className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-lg">
          <img src={QUOTE_VIDEO.poster} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/75 to-night/40" />

          <div className="relative px-8 py-14 lg:px-16 lg:py-20 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <h2 className="font-display font-semibold text-white text-[clamp(1.875rem,3.5vw,2.75rem)] leading-tight">
                {t('cta.title', { market: flavor.market })}
              </h2>
              <p className="text-white/75 mt-4 text-lg max-w-xl">
                {t('cta.body')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <a href={CONTACT.phoneHref} className="neopop-btn neopop-btn-dark w-full sm:w-auto lg:w-72">
                <Phone size={17} /> {t('cta.call', { phone: CONTACT.phoneDisplay })}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="neopop-btn w-full sm:w-auto lg:w-72 !bg-[#25D366] !border-[#25D366] hover:!bg-[#1ebe5b]"
              >
                <MessageCircle size={17} /> {t('cta.whatsapp')}
              </a>
              <Link to="/contact" className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1 justify-center lg:w-72 mt-1">
                {t('cta.message')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
