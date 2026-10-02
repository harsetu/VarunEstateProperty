import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function WhatsAppButton() {
  // Property pages have a sticky action bar on mobile; sit above it
  const onDetail = /^\/properties\/[^/]+/.test(useLocation().pathname);

  return (
    <a
      href="https://wa.me/919216507444?text=Hi%20Pahwa%20Real%20Estate,%20I%20would%20like%20to%20enquire%20about%20a%20property."
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${onDetail ? 'bottom-24 lg:bottom-6' : 'bottom-6'} right-6 z-[6000] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300`}
      aria-label="Chat on WhatsApp"
      data-cursor="hover"
    >
      <MessageCircle size={28} className="text-white" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
