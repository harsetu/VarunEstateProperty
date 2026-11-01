/**
 * Home banner media for the non-default themes.
 *
 * THEME2 plays a looping video. Drop your own file at `public/videos/hero.mp4`; until it exists the
 * brand's stock clip (flavor.content.heroVideo) is used, and the poster image shows if neither loads.
 */
export const HERO_VIDEO_LOCAL = '/videos/hero.mp4';

/** THEME3 shows these as a carousel; the photos live in `public/`. */
const SLIDE_IMAGES = ['/caraousal.jpeg', '/caraousal1.jpg', '/caraousal3.jpg', '/caraousal2.jpg', '/caraousal4.jpg'];

export const HERO_SLIDES: { image: string; titleKey: string; subtitleKey: string }[] = SLIDE_IMAGES.map((image, i) => ({
  image,
  titleKey: `heroc.s${i + 1}.title`,
  subtitleKey: `heroc.s${i + 1}.sub`,
}));
