import type { FlavorContent } from '@/flavors/types';

/** Marketing content shown on the home page (hero video, quotes, stats, steps, testimonials…). */
export type HomeContent = Pick<
  FlavorContent,
  'heroVideo' | 'quoteVideo' | 'quotes' | 'categories' | 'stats' | 'processSteps' | 'testimonials' | 'sectorInfo'
>;

export interface HomeRepository {
  getContent(): HomeContent;
}
