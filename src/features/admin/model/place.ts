/** A geocoded place picked from the location search. */
export interface GeoPlace {
  label: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}
