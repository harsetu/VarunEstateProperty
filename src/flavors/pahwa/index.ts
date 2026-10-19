import type { Flavor } from '@/flavors/types';
import * as c from '@/flavors/pahwa/content';

const flavor: Flavor = {
  id: 'pahwa',
  market: 'Panchkula',
  geo: { area: 'Panchkula', bounds: [76.78, 30.58, 76.98, 30.78] },
  contact: {
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
  },
  content: {
    heroVideo: c.HERO_VIDEO,
    quoteVideo: c.QUOTE_VIDEO,
    quotes: c.QUOTES,
    categories: c.CATEGORIES,
    stats: c.STATS,
    processSteps: c.PROCESS_STEPS,
    testimonials: c.TESTIMONIALS,
    types: c.TYPES,
    purposes: c.PURPOSES,
    sectorInfo: c.SECTOR_INFO,
  },
  // Switch to { kind: 'api', baseUrl: import.meta.env.VITE_API_BASE_URL } to load from a backend.
  source: { kind: 'static', properties: c.PROPERTIES, newProjects: c.NEW_PROJECTS, nearbyBySector: c.NEARBY_BY_SECTOR },
};

export default flavor;
