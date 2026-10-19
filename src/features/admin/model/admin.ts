export interface Profile {
  id?: number;
  username: string;
  name: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  role?: string;
}

export interface RecentProperty {
  id: number;
  propertyName: string;
  listingType: 'RENT' | 'SALE' | string;
  propertyCategory: string;
  location: string;
  city: string;
  price: number;
  currency: string;
  areaValue: number;
  areaUnit: string;
  bedrooms?: number;
  bathrooms?: number;
  coverImage?: string;
  createdAt: string;
}

export interface Dashboard {
  totalProperties: number;
  totalForRent: number;
  totalForSale: number;
  recentProperties: RecentProperty[];
}
