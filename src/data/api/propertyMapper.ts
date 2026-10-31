import type { NearbyCategory, NearbyPlace, Property, PropertyType, Purpose } from '@/domain/property';
import { formatINR } from '@/domain/pricing';
import { buildMapEmbedUrl } from '@/domain/contactLinks';

// ---- Backend DTOs (see the server's Swagger: PropertySummary / PropertyDetail / CreatePropertyRequest) ----
type Category = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'PLOT' | 'COMMERCIAL' | 'OTHER';
type AreaUnit = 'SQFT' | 'SQM' | 'SQYD' | 'ACRE';

export interface PropertySummaryDto {
  id: number;
  propertyName: string;
  listingType: 'RENT' | 'SELL';
  propertyCategory?: Category | null;
  location: string;
  city?: string | null;
  price: number;
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
  images?: { imageUrl: string; sortOrder?: number; cover?: boolean }[];
  nearby?: { name: string; category?: string | null; distanceKm?: number | null }[];
  featured?: boolean;
}

export interface PageDto<T> { content: T[]; page: number; totalPages: number }

// ---- Field mappings ----
const CATEGORY_TO_TYPE: Record<Category, PropertyType> = {
  APARTMENT: 'Flat', HOUSE: 'Builder Floor', VILLA: 'Builder Floor', PLOT: 'Plot', COMMERCIAL: 'Commercial', OTHER: 'Flat',
};
// "Builder Floor" and "Flat" both become APARTMENT on the server; HOUSE and VILLA read back as Builder Floor
const TYPE_TO_CATEGORY: Record<PropertyType, Category> = {
  Plot: 'PLOT', 'Builder Floor': 'APARTMENT', Flat: 'APARTMENT', Commercial: 'COMMERCIAL',
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
  type: CATEGORY_TO_TYPE[d.propertyCategory ?? 'OTHER'],
  purpose: (d.listingType === 'RENT' ? 'Rent' : 'Sale') as Purpose,
  sector: d.location,
  price: formatINR(d.price),
  priceValue: d.price,
  area: formatArea(d.areaValue, d.areaUnit),
  bedrooms: d.bedrooms ?? undefined,
  bathrooms: d.bathrooms ?? undefined,
  amenities: [],
  featured: false,
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
    .sort((a, b) => Number(b.cover ?? false) - Number(a.cover ?? false) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((i) => i.imageUrl);
  return {
    ...base(d),
    description: d.description ?? '',
    images,
    amenities: d.amenities ?? [],
    featured: Boolean(d.featured),
    mapEmbed: mapUrl(d),
    nearby: d.nearby?.length ? d.nearby.map(toNearby) : undefined,
  };
};

/** Website model -> CreatePropertyRequest. Fields the server has no column for (video, floor plans, map link) are dropped. */
export const toCreateRequest = (p: Property, city: string) => ({
  propertyName: p.title,
  listingType: p.purpose === 'Rent' ? 'RENT' : 'SELL',
  propertyCategory: TYPE_TO_CATEGORY[p.type],
  description: p.description,
  location: p.sector,
  city,
  price: p.priceValue,
  currency: 'INR',
  ...parseArea(p.area),
  bedrooms: p.bedrooms ?? null,
  bathrooms: p.bathrooms ?? null,
  amenities: p.amenities,
  images: p.images.map((imageUrl, i) => ({ imageUrl, cover: i === 0 })),
  nearby: (p.nearby ?? []).map((n) => ({ name: n.name, category: n.category, distanceKm: parseFloat(n.distance) || null })),
  featured: p.featured,
});
