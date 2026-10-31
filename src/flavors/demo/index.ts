import type { Flavor } from '../types';
import pahwa from '../pahwa';

// Template for a second website. Copy this folder, change the branding and
// point `source` at that site's API. Content is borrowed from Pahwa until replaced.
const flavor: Flavor = {
  id: 'demo',
  market: 'Your City',
  contact: {
    company: 'Demo Realty',
    tagline: 'Find. Visit. Move in',
    person: 'Demo Agent',
    address: '1 Example Road, Your City',
    addressShort: 'Example Road, Your City',
    mapQuery: 'Example Road, Your City',
    phones: [{ display: '+91 90000 00000', href: 'tel:+919000000000' }],
    phoneDisplay: '+91 90000 00000',
    phoneHref: 'tel:+919000000000',
    email: 'hello@example.com',
    whatsapp: '919000000000',
  },
  content: pahwa.content,
  source: { kind: 'api', baseUrl: `${import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com'}/api` },
};

export default flavor;
