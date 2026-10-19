import { images } from '@/res';
import type { Flavor } from '@/flavors/types';
import pahwa from '@/flavors/pahwa';
import type { Property } from '@/features/properties/model/property';

// PLACEHOLDER DETAILS — replace contact info, listings and copy with R World's real data.
const SECTORS = ['All', 'Sector 15', 'Sector 21', 'NIT', 'Greater Faridabad', 'Ballabgarh'];

const sample: Property[] = pahwa.source.kind === 'static'
  ? pahwa.source.properties.slice(0, 6).map((p, i) => ({
      ...p,
      id: `af-${i + 1}`,
      sector: SECTORS[1 + (i % (SECTORS.length - 1))],
      nearby: undefined,
    }))
  : [];

const flavor: Flavor = {
  id: 'rworld',
  market: 'Faridabad',
  logo: images.logos.rworld,
  geo: { area: 'Faridabad', bounds: [77.1, 28.15, 77.52, 28.52] },
  owner: { name: 'Smeer Arora', photo: images.owners.smeer },
  contact: {
    company: 'R World',
    tagline: 'Your property, our priority',
    person: 'Smeer Arora',
    address: 'Sector 15, Faridabad, Haryana',
    addressShort: 'Sector 15, Faridabad',
    mapQuery: 'Sector 15, Faridabad, Haryana',
    phones: [{ display: '+91 90000 00000', href: 'tel:+919000000000' }],
    phoneDisplay: '+91 90000 00000',
    phoneHref: 'tel:+919000000000',
    email: 'hello@rworld.example.com',
    whatsapp: '919000000000',
  },
  content: {
    ...pahwa.content,
    heroVideo: { url: '/world-street-hero.mp4', poster: pahwa.content.heroVideo.poster },
    sectorInfo: Object.fromEntries(
      SECTORS.slice(1).map((s) => [s, { vibe: `Popular address in ${s}, Faridabad — add a short description.`, tags: ['Well connected', 'Growing demand'] }]),
    ),
  },
  // Swap for { kind: 'api', baseUrl: import.meta.env.VITE_API_BASE_URL } when a backend exists.
  source: { kind: 'static', properties: sample, newProjects: [], nearbyBySector: {} },
};

export default flavor;
