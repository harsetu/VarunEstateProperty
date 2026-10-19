import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { CONTACT, whatsappLink } from '@/core/config/contact';
import { t } from '@/core/utils/i18n';
import { AnalyticsEvent } from '@/constants/analytics';
import { analytics } from '@/core/analytics/analytics';

export default function WhatsAppButton() {
  // Property pages have a sticky action bar on mobile; sit above it
  const onDetail = /^\/properties\/[^/]+/.test(useLocation().pathname);

  return (
    <a
      href={whatsappLink(t('whatsapp.enquiry', { company: CONTACT.company }))}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${onDetail ? 'bottom-24 lg:bottom-6' : 'bottom-6'} right-6 z-[6000] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300`}
      aria-label={t('whatsapp.chat')}
      data-cursor="hover"
      onClick={() => analytics.track(AnalyticsEvent.whatsappClick, { source: 'floating_button' })}
    >
      <MessageCircle size={28} className="text-white" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
