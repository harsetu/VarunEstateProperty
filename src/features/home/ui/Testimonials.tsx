import { Star, Quote } from 'lucide-react';
import { useHomeContent } from '@/features/home/viewmodel/useHomeContent';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import SectionHeading from '@/core/widgets/SectionHeading';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';

export default function Testimonials() {
  const { testimonials: TESTIMONIALS } = useHomeContent();
  return (
    <section className="py-20 lg:py-28 bg-ink-900">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow={t('testimonials.eyebrow')}
          title={rich('testimonials.title')}
        />
      </div>

      {/* Swipeable row on mobile, 3-column grid on desktop */}
      <div className="flex lg:grid lg:grid-cols-3 gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory px-5 lg:px-8 max-w-[1280px] mx-auto pb-4 [scrollbar-width:none]">
        {TESTIMONIALS.slice(0, 3).map((story, i) => (
          <ScrollReveal key={story.author} delay={i * 0.08} className="snap-start shrink-0 w-[85%] sm:w-[60%] lg:w-auto">
            <figure className="h-full flex flex-col rounded-2xl bg-white shadow-card p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <Quote size={28} className="text-gold/25" />
              </div>
              <blockquote className="text-fg/85 leading-relaxed flex-1">“{story.quote}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-fg/10">
                <div className="w-11 h-11 rounded-full bg-gold/15 text-gold flex items-center justify-center font-display font-semibold text-lg">
                  {story.author.charAt(0)}
                </div>
                <div>
                  <p className="text-fg font-semibold">{story.author}</p>
                  <p className="text-ash text-sm">{story.location}</p>
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
