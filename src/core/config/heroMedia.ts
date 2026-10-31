import { images } from '@/res';

/**
 * Home banner media for the non-default themes.
 *
 * THEME2 plays a looping video. Drop your own file at `public/videos/hero.mp4`; until it exists the
 * brand's stock clip (flavor.content.heroVideo) is used, and the poster image shows if neither loads.
 */
export const HERO_VIDEO_LOCAL = '/videos/hero.mp4';

/**
 * THEME3 shows these as a carousel. Replace or extend with your own photos
 * (put files in src/res/images/hero and import them in src/res/index.ts, or use URLs).
 */
export const HERO_SLIDES: { image: string; titleKey: string; subtitleKey: string }[] = [
  { image: images.hero.heroPoster, titleKey: 'heroc.s1.title', subtitleKey: 'heroc.s1.sub' },
  { image: images.categories.builderFloor, titleKey: 'heroc.s2.title', subtitleKey: 'heroc.s2.sub' },
  { image: images.categories.flat, titleKey: 'heroc.s3.title', subtitleKey: 'heroc.s3.sub' },
  { image: images.categories.commercial, titleKey: 'heroc.s4.title', subtitleKey: 'heroc.s4.sub' },
  { image: images.hero.quotePoster, titleKey: 'heroc.s5.title', subtitleKey: 'heroc.s5.sub' },
];
