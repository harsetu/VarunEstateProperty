import type { FloorAvailability, Furnishing, Label, ListingStatus, NearbyCategory, NearbyPlace, Property, PropertyExtras, PropertyType, Purpose } from '@/features/properties/model/property';
import { formatINR } from '@/core/utils/pricing';
import { t } from '@/core/utils/i18n';
import { buildMapEmbedUrl } from '@/core/utils/contactLinks';

// ---- Backend DTOs (see the server's Swagger: PropertySummary / PropertyDetail / CreatePropertyRequest) ----
type Category = 'APARTMENT' | 'BUILDER_FLOOR' | 'HOUSE' | 'VILLA' | 'PLOT' | 'COMMERCIAL' | 'OTHER';
type AreaUnit = 'SQFT' | 'SQM' | 'SQYD' | 'ACRE';

export interface PropertySummaryDto {
  id: number;
  propertyName: string;
  listingType: 'RENT' | 'SELL';
  propertyCategory?: Category | null;
  location: string;
  city?: string | null;
  price?: number | null;
  hidePrice?: boolean;
  labels?: Label[] | null;
  currency?: string;
  areaValue?: number | null;
  areaUnit?: AreaUnit | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  coverImage?: string | null;
}

export interface PropertyDetailDto extends Omit<PropertySummaryDto, 'coverImage'> {
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  amenities?: string[];
  images?: { imageUrl: string; sortOrder?: number; cover?: boolean; isCover?: boolean }[];
  nearby?: { name: string; category?: string | null; distanceKm?: number | null }[];
  featured?: boolean;
  isFeatured?: boolean;
  status?: ListingStatus | null;
  info?: string | null;
  address?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  priceNegotiable?: boolean;
  securityDeposit?: number | null;
  maintenanceCharge?: number | null;
  balconies?: number | null;
  parkingSpots?: number | null;
  floorNumber?: number | null;
  totalFloors?: number | null;
  floorAvailability?: FloorAvailability | null;
  availableFloors?: number[] | null;
  furnishing?: Furnishing | null;
  facing?: string | null;
  propertyAgeYears?: number | null;
  availableFrom?: string | null;
  usps?: string[] | null;
  tags?: string[] | null;
  paperwork?: string | null;
}

export interface PageDto<T> { content: T[]; page: number; totalPages: number; totalElements: number }

// ---- Field mappings ----
const CATEGORY_TO_TYPE: Record<Category, PropertyType> = {
  APARTMENT: 'Flat', BUILDER_FLOOR: 'Builder Floor', HOUSE: 'Builder Floor', VILLA: 'Builder Floor', PLOT: 'Plot', COMMERCIAL: 'Commercial', OTHER: 'Flat',
};
// Flat -> APARTMENT, Builder Floor -> BUILDER_FLOOR; HOUSE and VILLA also read back as Builder Floor
const TYPE_TO_CATEGORY: Record<PropertyType, Category> = {
  Plot: 'PLOT', 'Builder Floor': 'BUILDER_FLOOR', Flat: 'APARTMENT', Commercial: 'COMMERCIAL',
};
const UNIT_LABEL: Record<AreaUnit, string> = { SQFT: 'sq.ft', SQM: 'sq.m', SQYD: 'sq.yd', ACRE: 'acre' };

const formatArea = (value?: number | null, unit?: AreaUnit | null) =>
  value ? `${value.toLocaleString('en-IN')} ${UNIT_LABEL[unit ?? 'SQFT']}` : '';

/** "5,200 sq.ft" -> { areaValue: 5200, areaUnit: 'SQFT' } */
const parseArea = (text: string): { areaValue: number | null; areaUnit: AreaUnit | null } => {
  const value = parseFloat(text.replace(/,/g, ''));
  if (!(value > 0)) return { areaValue: null, areaUnit: null };
  const t = text.toLowerCase();
  const areaUnit: AreaUnit = /acre/.test(t) ? 'ACRE' : /yd|gaj|yard/.test(t) ? 'SQYD' : /sq\.?\s?m|meter|metre/.test(t) ? 'SQM' : 'SQFT';
  return { areaValue: value, areaUnit };
};

const NEARBY_CATEGORIES: NearbyCategory[] = ['school', 'hospital', 'market', 'transport', 'park'];
const toNearbyCategory = (c?: string | null): NearbyCategory =>
  NEARBY_CATEGORIES.find((k) => k === c?.toLowerCase()) ?? 'market';

const toNearby = (n: NonNullable<PropertyDetailDto['nearby']>[number]): NearbyPlace => ({
  category: toNearbyCategory(n.category),
  name: n.name,
  distance: n.distanceKm != null ? `${n.distanceKm} km` : '',
});

const base = (d: PropertySummaryDto): Omit<Property, 'images' | 'mapEmbed' | 'description'> => ({
  id: String(d.id),
  title: d.propertyName,
  type: CATEGORY_TO_TYPE[d.propertyCategory ?? 'OTHER'] ?? 'Flat',
  purpose: (d.listingType === 'RENT' ? 'Rent' : 'Sale') as Purpose,
  sector: d.location,
  price: d.price == null || d.hidePrice ? t('price.onRequest') : formatINR(d.price),
  priceValue: d.price ?? 0,
  area: formatArea(d.areaValue, d.areaUnit),
  bedrooms: d.bedrooms ?? undefined,
  bathrooms: d.bathrooms ?? undefined,
  amenities: [],
  featured: Boolean(d.labels?.includes('FEATURED')),
  hidePrice: Boolean(d.hidePrice),
  labels: d.labels ?? [],
});

const opt = <T,>(v: T | null | undefined) => v ?? undefined;

const extras = (d: PropertyDetailDto): PropertyExtras => ({
  info: opt(d.info), status: opt(d.status), address: opt(d.address), city: opt(d.city), state: opt(d.state),
  country: opt(d.country), pincode: opt(d.pincode), latitude: opt(d.latitude), longitude: opt(d.longitude),
  priceNegotiable: Boolean(d.priceNegotiable), securityDeposit: opt(d.securityDeposit), maintenanceCharge: opt(d.maintenanceCharge),
  balconies: opt(d.balconies), parkingSpots: opt(d.parkingSpots), floorNumber: opt(d.floorNumber), totalFloors: opt(d.totalFloors),
  floorAvailability: opt(d.floorAvailability), availableFloors: d.availableFloors ?? undefined,
  furnishing: opt(d.furnishing), facing: opt(d.facing), propertyAgeYears: opt(d.propertyAgeYears),
  availableFrom: opt(d.availableFrom)?.slice(0, 10), usps: d.usps ?? [], tags: d.tags ?? [], paperwork: opt(d.paperwork),
});

const mapUrl = (d: { location: string; city?: string | null; latitude?: number | null; longitude?: number | null }) =>
  d.latitude != null && d.longitude != null
    ? `https://www.google.com/maps?q=${d.latitude},${d.longitude}&output=embed`
    : buildMapEmbedUrl([d.location, d.city].filter(Boolean).join(', '));

/** List rows only carry the cover image, so images/amenities fill in on the detail page. */
export const fromSummary = (d: PropertySummaryDto): Property => ({
  ...base(d),
  description: '',
  images: d.coverImage ? [d.coverImage] : [],
  mapEmbed: mapUrl(d),
});

export const fromDetail = (d: PropertyDetailDto): Property => {
  const images = [...(d.images ?? [])]
    .sort((a, b) => Number(b.isCover ?? b.cover ?? false) - Number(a.isCover ?? a.cover ?? false) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((i) => i.imageUrl);
  return {
    ...base(d),
    ...extras(d),
    description: d.description ?? '',
    images,
    amenities: d.amenities ?? [],
    featured: Boolean(d.featured ?? d.isFeatured) || Boolean(d.labels?.includes('FEATURED')),
    mapEmbed: mapUrl(d),
    nearby: d.nearby?.length ? d.nearby.map(toNearby) : undefined,
  };
};

/** Website model -> CreatePropertyRequest. Fields the server has no column for (video, floor plans, map link) are dropped. */
export const toCreateRequest = (p: Property, city: string) => {
  const text = (v?: string) => v?.trim() || null;
  const labels = new Set(p.labels ?? []);
  if (p.featured) labels.add('FEATURED'); else labels.delete('FEATURED');
  return {
    propertyName: p.title,
    listingType: p.purpose === 'Rent' ? 'RENT' : 'SELL',
    propertyCategory: TYPE_TO_CATEGORY[p.type],
    status: p.status ?? 'ACTIVE',
    info: text(p.info),
    description: p.description,
    location: p.sector,
    address: text(p.address),
    city: text(p.city) ?? city,
    state: text(p.state),
    country: text(p.country),
    pincode: text(p.pincode),
    latitude: p.latitude ?? null,
    longitude: p.longitude ?? null,
    price: p.priceValue,
    currency: 'INR',
    priceNegotiable: Boolean(p.priceNegotiable),
    hidePrice: Boolean(p.hidePrice),
    securityDeposit: p.securityDeposit ?? null,
    maintenanceCharge: p.maintenanceCharge ?? null,
    ...parseArea(p.area),
    bedrooms: p.bedrooms ?? null,
    bathrooms: p.bathrooms ?? null,
    balconies: p.balconies ?? null,
    parkingSpots: p.parkingSpots ?? null,
    floorNumber: p.floorNumber ?? null,
    totalFloors: p.totalFloors ?? null,
    // only sent when chosen, so a backend without these fields is not bothered
    ...(p.floorAvailability && {
      floorAvailability: p.floorAvailability,
      availableFloors: p.floorAvailability === 'MULTIPLE' ? p.availableFloors ?? [] : [],
    }),
    furnishing: p.furnishing ?? null,
    facing: text(p.facing),
    propertyAgeYears: p.propertyAgeYears ?? null,
    availableFrom: text(p.availableFrom),
    amenities: p.amenities,
    usps: p.usps ?? [],
    tags: p.tags ?? [],
    labels: [...labels],
    paperwork: text(p.paperwork),
    images: p.images.map((imageUrl, i) => ({ imageUrl, cover: i === 0 })),
    nearby: (p.nearby ?? []).map((n) => ({ name: n.name, category: n.category, distanceKm: parseFloat(n.distance) || null })),
    featured: p.featured,
  };
};
