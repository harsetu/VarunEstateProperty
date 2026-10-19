import type { FloorAvailability, Property, PropertyType, Purpose } from '@/features/properties/model/property';

/** Which optional inputs make sense for the chosen property type and purpose. */
export interface FieldRules {
  bedrooms: boolean;
  bathrooms: boolean;
  balconies: boolean;
  parking: boolean;
  floors: boolean;
  furnishing: boolean;
  age: boolean;
  maintenance: boolean;
  /** Rent only. */
  deposit: boolean;
}

const BY_TYPE: Record<PropertyType, Omit<FieldRules, 'deposit'>> = {
  Plot: { bedrooms: false, bathrooms: false, balconies: false, parking: false, floors: false, furnishing: false, age: false, maintenance: false },
  Commercial: { bedrooms: false, bathrooms: true, balconies: false, parking: true, floors: true, furnishing: true, age: true, maintenance: true },
  Flat: { bedrooms: true, bathrooms: true, balconies: true, parking: true, floors: true, furnishing: true, age: true, maintenance: true },
  'Builder Floor': { bedrooms: true, bathrooms: true, balconies: true, parking: true, floors: true, furnishing: true, age: true, maintenance: true },
};

export const fieldRules = (type: PropertyType, purpose: Purpose): FieldRules => ({
  ...(BY_TYPE[type] ?? BY_TYPE.Flat),
  deposit: purpose === 'Rent',
});

/** Single is the starting point until the admin picks another. */
export const effectiveAvailability = (p: Property): FloorAvailability => p.floorAvailability ?? 'SINGLE';

/** Drops values of inputs that are hidden for this type/purpose so they are not saved by accident. */
export const sanitize = (p: Property): Property => {
  const r = fieldRules(p.type, p.purpose);
  const avail = effectiveAvailability(p);
  return {
    ...p,
    bedrooms: r.bedrooms ? p.bedrooms : undefined,
    bathrooms: r.bathrooms ? p.bathrooms : undefined,
    balconies: r.balconies ? p.balconies : undefined,
    parkingSpots: r.parking ? p.parkingSpots : undefined,
    furnishing: r.furnishing ? p.furnishing : undefined,
    propertyAgeYears: r.age ? p.propertyAgeYears : undefined,
    maintenanceCharge: r.maintenance ? p.maintenanceCharge : undefined,
    securityDeposit: r.deposit ? p.securityDeposit : undefined,
    totalFloors: r.floors ? p.totalFloors : undefined,
    floorAvailability: r.floors ? avail : undefined,
    floorNumber: r.floors && avail === 'SINGLE' ? p.floorNumber : undefined,
    availableFloors: r.floors && avail === 'MULTIPLE' ? p.availableFloors : undefined,
  };
};
