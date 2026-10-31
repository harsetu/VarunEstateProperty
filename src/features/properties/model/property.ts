export type PropertyType = 'Plot' | 'Builder Floor' | 'Flat' | 'Commercial';
export type Purpose = 'Sale' | 'Rent';

export const LISTING_STATUSES = ['DRAFT', 'ACTIVE', 'SOLD', 'RENTED', 'INACTIVE'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];
export const FURNISHINGS = ['UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED'] as const;
export type Furnishing = (typeof FURNISHINGS)[number];
export const LABELS = ['FEATURED', 'NEW_LAUNCH', 'UPCOMING', 'RESALE', 'EXCLUSIVE'] as const;
export type Label = (typeof LABELS)[number];
export const FLOOR_AVAILABILITY = ['SINGLE', 'MULTIPLE', 'ALL'] as const;
export type FloorAvailability = (typeof FLOOR_AVAILABILITY)[number];
export const AREA_UNITS = ['SQFT', 'SQM', 'SQYD', 'ACRE'] as const;

/** Extra columns of the backend's property_listing table; all optional so static flavor data keeps working. */
export interface PropertyExtras {
  info?: string;
  status?: ListingStatus;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  priceNegotiable?: boolean;
  hidePrice?: boolean;
  securityDeposit?: number;
  maintenanceCharge?: number;
  balconies?: number;
  parkingSpots?: number;
  floorNumber?: number;
  totalFloors?: number;
  /** Which floors of the building are on offer. Sent to the backend as `floorAvailability` / `availableFloors`. */
  floorAvailability?: FloorAvailability;
  availableFloors?: number[];
  furnishing?: Furnishing;
  facing?: string;
  propertyAgeYears?: number;
  /** YYYY-MM-DD */
  availableFrom?: string;
  usps?: string[];
  tags?: string[];
  labels?: Label[];
  paperwork?: string;
}

export interface Property extends PropertyExtras {
  id: string;
  title: string;
  type: PropertyType;
  purpose: Purpose;
  sector: string;
  /** Display text, already formatted (a range when `priceMax` is set). */
  price: string;
  /** Lower end of the price (the fixed price when there is no `priceMax`). */
  priceValue: number;
  /** Upper end of a tentative range; absent for a fixed price. */
  priceMax?: number;
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
  /** Extra photos; when more than one, the card shows a pager and auto-scrolls. */
  images?: string[];
  highlights: string[];
}
