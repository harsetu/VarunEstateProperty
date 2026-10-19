import type { HomeContent, HomeRepository } from '@/features/home/repository/HomeRepository';
import type { Flavor } from '@/flavors/types';

/** Serves home-page content from the active flavor's config. Swap for a CMS/API-backed one later. */
export class FlavorHomeRepository implements HomeRepository {
  constructor(private readonly flavor: Flavor) {}

  getContent(): HomeContent {
    const { heroVideo, quoteVideo, quotes, categories, stats, processSteps, testimonials, sectorInfo } = this.flavor.content;
    return { heroVideo, quoteVideo, quotes, categories, stats, processSteps, testimonials, sectorInfo };
  }
}
