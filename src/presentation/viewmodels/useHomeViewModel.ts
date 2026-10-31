import { useMemo } from 'react';
import { useCatalog } from '@/presentation/CatalogProvider';
import { groupBySector, sortProperties, startingPrice } from '@/domain/propertyRules';
import { CATEGORIES } from '@/data/properties';

/** Everything the home page sections need, derived from the catalog. */
export function useHomeViewModel() {
  const { status, properties, projects, sectors, error, reload } = useCatalog();

  return useMemo(() => {
    const featured = sortProperties(properties).slice(0, 6);
    const lead = properties[0];
    const categoryStats = Object.fromEntries(
      CATEGORIES.map((c) => {
        const list = properties.filter((p) => p.type === c.name);
        return [c.name, { count: list.length, from: startingPrice(list) }];
      }),
    );
    return {
      status, error, reload, properties, projects, sectors, featured, categoryStats,
      bySector: groupBySector(properties),
      hero: {
        count: properties.length,
        main: lead?.images[0],
        // List rows carry only a cover image, so fall back to other listings' covers
        side: lead?.images[1] ?? properties[1]?.images[0] ?? lead?.images[0],
        pill: properties[2]?.images[0] ?? lead?.images[0],
        justListed: properties[1] ?? lead,
      },
    };
  }, [status, error, reload, properties, projects, sectors]);
}
