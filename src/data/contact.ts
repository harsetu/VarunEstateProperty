import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

// Business contact details used in the top ribbon and footer.
// Replace '#' with the real profile URLs.
export const CONTACT = {
  address: 'Sector 7, Panchkula, Haryana 134109',
  phoneDisplay: '+91 92165 07444',
  phoneHref: 'tel:+919216507444',
  email: 'hello@varunestate.in',
  whatsapp: '919216507444',
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

// Indian mobile: optional +91/0 prefix, then 10 digits starting 6-9
export const normalizePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'YouTube', href: '#', icon: Youtube },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
];
