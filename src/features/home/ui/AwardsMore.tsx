import { useState } from 'react';
import { AWARD_IMAGES_MORE } from '@/core/config/awards';
import AwardFrame from '@/features/home/ui/AwardFrame';
import ImageLightbox from '@/core/widgets/ImageLightbox';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';

/** Second awards section: a plain grid of equal frames; click enlarges. */
export default function AwardsMore() {
  const [zoom, setZoom] = useState<number | null>(null);
  if (AWARD_IMAGES_MORE.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8 bg-ink-900">
      <div className="max-w-[1280px] mx-auto">
        <ScrollReveal className="mb-10 lg:mb-14 max-w-2xl">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.18em] mb-3">{t('awards2.eyebrow')}</p>
          <h2 className="font-display font-semibold text-fg text-[clamp(1.875rem,3.5vw,2.75rem)] leading-tight tracking-tight">
            {rich('awards2.title')}
          </h2>
          <p className="text-ash mt-4 leading-relaxed">{t('awards2.subtitle')}</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {AWARD_IMAGES_MORE.map((src, i) => (
            <ScrollReveal key={src} delay={i * 0.08} y={20}>
              <AwardFrame src={src} n={i + 1} onOpen={() => setZoom(i)} className="w-full" />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {zoom !== null && (
        <ImageLightbox images={AWARD_IMAGES_MORE} index={zoom} alt={t('awards.alt', { n: zoom + 1 })} onChange={setZoom} onClose={() => setZoom(null)} />
      )}
    </section>
  );
}
