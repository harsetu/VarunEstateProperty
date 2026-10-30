import { usePublicReviews } from '@/features/reviews/viewmodel/usePublicReviews';
import ReviewCard from '@/features/reviews/ui/ReviewCard';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import SectionHeading from '@/core/widgets/SectionHeading';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';

const SHOWN = 6;

/** Customer reviews from the API. Renders nothing while there are none (or the request failed). */
export default function Reviews() {
  const { loading, items } = usePublicReviews();
  if (!loading && items.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8 bg-ink-900">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading eyebrow={t('reviewsHome.eyebrow')} title={rich('reviewsHome.title')} subtitle={t('reviewsHome.subtitle')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 rounded-2xl bg-white/60 animate-pulse" aria-hidden />)
            : items.slice(0, SHOWN).map((review, i) => (
                <ScrollReveal key={review.id} delay={(i % 3) * 0.08} className="h-full">
                  <ReviewCard review={review} />
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  );
}
