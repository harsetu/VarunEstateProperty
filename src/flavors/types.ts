import type { NearbyPlace, NewProject, Property } from '@/features/properties/model/property';

export interface Contact {
  company: string;
  tagline: string;
  person: string;
  address: string;
  addressShort: string;
  mapQuery: string;
  phones: { display: string; href: string }[];
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  whatsapp: string;
}

export interface Media { url: string; poster: string }

/** Marketing copy and lookups that belong to a brand rather than to the listings API. */
export interface FlavorContent {
  heroVideo: Media;
  quoteVideo: Media;
  quotes: string[];
  categories: { name: string; number: string; image: string; desc: string }[];
  stats: { value: number; suffix: string; label: string }[];
  processSteps: { number: string; title: string; desc: string }[];
  testimonials: { quote: string; author: string; location: string }[];
  types: string[];
  purposes: string[];
  sectorInfo: Record<string, { vibe: string; tags: string[] }>;
}

export type DataSource =
  | { kind: 'static'; properties: Property[]; newProjects: NewProject[]; nearbyBySector: Record<string, NearbyPlace[]> }
  | { kind: 'api'; baseUrl: string; headers?: Record<string, string> };

/** One real-estate website = one flavor. */
export interface Flavor {
  id: string;
  /** City / market name used in a few headlines. */
  market: string;
  contact: Contact;
  /** Logo image (used in the header, footer, preloader and as the tab icon). Omit to draw the default mark. */
  logo?: string;
  /** Where this business works; the listing location search only returns places named `area` inside this box [west, south, east, north]. */
  geo?: { area: string; bounds: [number, number, number, number] };
  /** Business owner shown on the About page. */
  owner?: { name: string; photo: string };
  content: FlavorContent;
  source: DataSource;
}
