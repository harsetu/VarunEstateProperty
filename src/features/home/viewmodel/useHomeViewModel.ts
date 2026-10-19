import { useMemo } from 'react';
import { useCatalog } from '@/features/properties/viewmodel/CatalogProvider';
import { groupBySector, sortProperties, startingPrice } from '@/features/properties/model/propertyRules';
import { homeRepository } from '@/app/container';
import { images } from '@/res';

/** Everything the home page sections need, derived from the catalog. */
export function useHomeViewModel() {
  const { status, properties, projects, sectors, error, reload } = useCatalog();

  return useMemo(() => {
    const content = homeRepository.getContent();
    const featured = sortProperties(properties).slice(0, 6);
    const lead = properties[0];
    const categoryStats = Object.fromEntries(
      content.categories.map((c) => {
        const list = properties.filter((p) => p.type === c.name);
        return [c.name, { count: list.length, from: startingPrice(list) }];
      }),
    );
    return {
      content, status, error, reload, properties, projects, sectors, featured, categoryStats,
      bySector: groupBySector(properties),
      hero: {
        count: properties.length,
        main: lead?.images[0] ?? images.placeholder,
        // List rows carry only a cover image, so fall back to other listings' covers
        side: lead?.images[1] ?? properties[1]?.images[0] ?? lead?.images[0] ?? images.placeholder,
        pill: properties[2]?.images[0] ?? lead?.images[0] ?? images.placeholder,
        justListed: properties[1] ?? lead,
      },
    };
  }, [status, error, reload, properties, projects, sectors]);
}
