import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Marquee() {
  const stripRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip) return;

    const ctx = gsap.context(() => {
      gsap.to(strip, {
        x: '-50%',
        duration: 30,
        ease: 'none',
        repeat: -1,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const items = ['KOTHIS', 'PLOTS', 'BUILDER FLOORS', 'FLATS', 'COMMERCIAL'];

  return (
    <section ref={sectionRef} className="relative py-12 bg-ink-900 overflow-hidden border-y border-fg/5">
      <div ref={stripRef} className="flex whitespace-nowrap will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {items.map((item, i) => (
              <div key={`${dup}-${i}`} className="flex items-center">
                <span className="font-display font-semibold text-outline-dark text-[clamp(2.25rem,7vw,5.5rem)] tracking-tight px-8">
                  {item}
                </span>
                <span className="text-gold text-[clamp(1.875rem,4.5vw,3.75rem)] px-2">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
