import { useState } from 'react';
import { AWARD_IMAGES } from '@/core/config/awards';
import AwardFrame from '@/features/home/ui/AwardFrame';
import ImageLightbox from '@/core/widgets/ImageLightbox';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';

/** Awards & recognition: one row of equal frames that drifts sideways; hover pauses it, click enlarges. */
export default function Awards() {
  const [zoom, setZoom] = useState<number | null>(null);
  if (AWARD_IMAGES.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-ink-800 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <ScrollReveal className="mb-10 lg:mb-14 max-w-2xl">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.18em] mb-3">{t('awards.eyebrow')}</p>
          <h2 className="font-display font-semibold text-fg text-[clamp(1.875rem,3.5vw,2.75rem)] leading-tight tracking-tight">
            {rich('awards.title')}
          </h2>
          <p className="text-ash mt-4 leading-relaxed">{t('awards.subtitle')}</p>
        </ScrollReveal>
      </div>

      {/* The strip is rendered twice so the loop is seamless; the copy is hidden from assistive tech */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-5 pr-5" aria-hidden={copy === 1}>
            {AWARD_IMAGES.map((src, i) => (
              <AwardFrame key={src} src={src} n={i + 1} onOpen={() => setZoom(i)} className="w-[280px] sm:w-[340px]" />
            ))}
          </div>
        ))}
      </div>

      {zoom !== null && (
        <ImageLightbox images={AWARD_IMAGES} index={zoom} alt={t('awards.alt', { n: zoom + 1 })} onChange={setZoom} onClose={() => setZoom(null)} />
      )}
    </section>
  );
}
