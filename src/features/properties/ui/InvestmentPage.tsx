import { useMemo } from 'react';
import { useCatalog } from '@/features/properties/viewmodel/CatalogProvider';
import { projectsWithLabel } from '@/features/properties/model/propertyRules';
import NewProjects from '@/features/home/ui/NewProjects';
import { t } from '@/core/utils/i18n';

export default function Investment() {
  const { properties } = useCatalog();
  const launches = useMemo(() => projectsWithLabel(properties, 'NEW_LAUNCH'), [properties]);
  const upcoming = useMemo(() => projectsWithLabel(properties, 'UPCOMING'), [properties]);

  return (
    <div className="min-h-screen bg-ink-900 pt-28">

      <NewProjects
        projects={launches}
        heading={{ eyebrow: t('invest.launchesEyebrow'), title: t('invest.launchesTitle'), subtitle: t('invest.launchesSubtitle') }}
      />
      <NewProjects
        bg="bg-nightalt"
        projects={upcoming}
        heading={{ eyebrow: t('invest.upcomingEyebrow'), title: t('invest.upcomingTitle'), subtitle: t('invest.upcomingSubtitle') }}
      />
      {launches.length === 0 && upcoming.length === 0 && (
        <p className="text-ash text-center py-20">{t('invest.empty')}</p>
      )}
    </div>
  );
}
