// Bundled images. Import from here instead of hard-coding URLs:  import { images } from '@/res';
import plot from './images/categories/plot.jpg';
import builderFloor from './images/categories/builder-floor.jpg';
import flat from './images/categories/flat.jpg';
import commercial from './images/categories/commercial.jpg';
import heroPoster from './images/hero/hero-poster.jpg';
import quotePoster from './images/hero/quote-poster.jpg';
import rworldLogo from './images/logos/rworld.jpg';
import smeer from './images/owner/smeer.jpeg';
import placeholderProperty from './images/placeholder-property.svg';

export const images = {
  categories: { plot, builderFloor, flat, commercial },
  hero: { heroPoster, quotePoster },
  owners: { smeer },
  logos: { rworld: rworldLogo },
  /** Shown when a listing has no photo. */
  placeholder: placeholderProperty,
} as const;
