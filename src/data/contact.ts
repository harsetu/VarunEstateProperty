import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

// Business details from the visiting card — the one place to edit them.
// Replace '#' in SOCIAL_LINKS with the real profile URLs.
export const CONTACT = {
  company: 'Pahwa Real Estate',
  tagline: 'Dream. Search. Live',
  person: 'Varun Pahwa',
  address: 'Booth No. 63, Sector 5, MDC, Panchkula',
  addressShort: 'Sector 5, MDC, Panchkula',
  mapQuery: 'Booth No 63, Sector 5, MDC, Panchkula, Haryana',
  phones: [
    { display: '+91 92165 07444', href: 'tel:+919216507444' },
    { display: '+91 88378 25402', href: 'tel:+918837825402' },
  ],
  phoneDisplay: '+91 92165 07444',
  phoneHref: 'tel:+919216507444',
  email: 'pahwarrealestate21@gmail.com',
  whatsapp: '919216507444',
};

export const mapEmbedUrl = (query: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

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
