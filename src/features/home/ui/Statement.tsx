import { cssColor } from '@/core/theme/themes';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT } from '@/core/config/contact';
import { t } from '@/core/utils/i18n';

gsap.registerPlugin(ScrollTrigger);

const STATEMENT = [
  { text: t('statement.l1'), gold: false },
  { text: t('statement.l2'), gold: false },
  { text: t('statement.l3'), gold: true },
  { text: t('statement.l4'), gold: false },
  { text: t('statement.l5'), gold: false },
  { text: t('statement.l6'), gold: false },
  { text: t('statement.l7'), gold: false },
  { text: t('statement.l8'), gold: false },
  { text: t('statement.l9'), gold: true },
  { text: t('statement.l10'), gold: true },
  { text: t('statement.l11'), gold: false },
  { text: t('statement.promise', { company: CONTACT.company }), gold: false },
];

export default function Statement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wordsRef.current.forEach((w) => {
        if (w) w.style.color = cssColor('--c-fg');
      });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to(wordsRef.current, {
        color: (_i, el) => (el.dataset.gold === 'true' ? cssColor('--c-gold') : cssColor('--c-fg')),
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.8,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-48 bg-ink-900 flex items-center justify-center px-6">
      <div className="max-w-5xl text-center">
        <p className="font-display font-medium text-[clamp(1.375rem,3vw,2.5rem)] leading-[1.4] tracking-tight">
          {STATEMENT.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              data-gold={word.gold}
              className="inline-block mr-[0.3em] text-ash-dark transition-colors"
            >
              {word.text}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
