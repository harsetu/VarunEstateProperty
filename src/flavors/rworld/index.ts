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
  owner: { name: 'Sameer Arora', photo: images.owners.smeer },
  contact: {
    company: 'R World',
    tagline: 'Your property, our priority',
    person: 'Sameer Arora',
    address: 'Ground Floor, BPTP Park Avenue-40, Block Avenue-40, near DPS School, Sector 81, Faridabad, Haryana 121007',
    addressShort: 'Sector 81, Faridabad',
    mapQuery: '28.3951599,77.3467323',
    phones: [{ display: '+91 80142 02020', href: 'tel:+918014202020' }],
    phoneDisplay: '+91 80142 02020',
    phoneHref: 'tel:+918014202020',
    email: 'customercare@rworldrealestate.com',
    whatsapp: '918014202020',
  },
  content: {
    ...pahwa.content,
    sectorInfo: Object.fromEntries(
      SECTORS.slice(1).map((s) => [s, { vibe: `Popular address in ${s}, Faridabad — add a short description.`, tags: ['Well connected', 'Growing demand'] }]),
    ),
  },
  // Swap for { kind: 'api', baseUrl: import.meta.env.VITE_API_BASE_URL } when a backend exists.
  source: { kind: 'static', properties: sample, newProjects: [], nearbyBySector: {} },
};

export default flavor;
