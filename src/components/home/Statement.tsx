import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATEMENT = [
  { text: 'We don\u2019t just sell properties.', gold: false },
  { text: 'We curate', gold: false },
  { text: 'destinations', gold: true },
  { text: 'where lives unfold,', gold: false },
  { text: 'families grow,', gold: false },
  { text: 'and stories begin.', gold: false },
  { text: 'Every plot, every kothi, every flat', gold: false },
  { text: 'is handpicked with an obsession for', gold: false },
  { text: 'location,', gold: true },
  { text: 'quality,', gold: true },
  { text: 'and trust.', gold: false },
  { text: 'That\u2019s the Pahwa promise.', gold: false },
];

export default function Statement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wordsRef.current.forEach((w) => {
        if (w) w.style.color = '#16171B';
      });
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to(wordsRef.current, {
        color: (_i, el) => (el.dataset.gold === 'true' ? '#B8922B' : '#16171B'),
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
