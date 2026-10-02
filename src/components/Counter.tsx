import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Counter({ value, suffix = '', label, index }: { value: number; suffix?: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        ease: 'power2.out',
        delay: index * 0.15,
        onUpdate: () => setDisplay(Math.round(obj.val)),
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, index]);

  return (
    <div ref={ref}>
      <div className="font-display font-semibold text-fg text-[clamp(2rem,3.5vw,2.75rem)] leading-none tracking-tight">
        {display}<span className="text-gold">{suffix}</span>
      </div>
      <div className="text-ash text-sm mt-2">{label}</div>
    </div>
  );
}
