import flavor from '@/flavors';

// Filter options and type artwork of the active flavor.
export const TYPES = flavor.content.types;
export const PURPOSES = flavor.content.purposes;
export const CATEGORIES = flavor.content.categories;
export const TYPE_IMAGE: Record<string, string> = Object.fromEntries(flavor.content.categories.map((c) => [c.name, c.image]));
