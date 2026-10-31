export type PropertyType = 'Plot' | 'Builder Floor' | 'Flat' | 'Commercial';
export type Purpose = 'Sale' | 'Rent';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  purpose: Purpose;
  sector: string;
  price: string;
  priceValue: number;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  images: string[];
  amenities: string[];
  featured: boolean;
  mapEmbed: string;
  /** Floor plan image URLs. Leave out to show a "request floor plan" button. */
  floorPlans?: string[];
  /** YouTube embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID */
  videoUrl?: string;
  /** Overrides the sector's default nearby places. */
  nearby?: NearbyPlace[];
}

export type NearbyCategory = 'school' | 'hospital' | 'market' | 'transport' | 'park';

export interface NearbyPlace {
  category: NearbyCategory;
  name: string;
  distance: string;
}

export type ProjectStatus = 'Pre-Launch' | 'Under Construction' | 'Ready to Move';

export interface NewProject {
  id: string;
  name: string;
  developer: string;
  location: string;
  status: ProjectStatus;
  possession: string;
  configurations: string;
  sizeRange: string;
  startingPrice: string;
  image: string;
  highlights: string[];
}
