import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data/properties';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-ink-900">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow="Client stories"
          title={<>Families who found <em className="text-gold">their place</em></>}
        />
      </div>

      {/* Swipeable row on mobile, 3-column grid on desktop */}
      <div className="flex lg:grid lg:grid-cols-3 gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory px-5 lg:px-8 max-w-[1280px] mx-auto pb-4 [scrollbar-width:none]">
        {TESTIMONIALS.slice(0, 3).map((t, i) => (
          <ScrollReveal key={t.author} delay={i * 0.08} className="snap-start shrink-0 w-[85%] sm:w-[60%] lg:w-auto">
            <figure className="h-full flex flex-col rounded-2xl bg-white shadow-card p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} className="text-gold fill-gold" />
                  ))}
                </div>
                <Quote size={28} className="text-gold/25" />
              </div>
              <blockquote className="text-fg/85 leading-relaxed flex-1">“{t.quote}”</blockquote>
              <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-fg/10">
                <div className="w-11 h-11 rounded-full bg-gold/15 text-gold flex items-center justify-center font-display font-semibold text-lg">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-fg font-semibold">{t.author}</p>
                  <p className="text-ash text-sm">{t.location}</p>
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
