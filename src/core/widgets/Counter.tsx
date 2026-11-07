import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 2000;

/** Counts up to `value` the first time it scrolls into view. */
export default function Counter({ value, suffix = '', label, index }: { value: number; suffix?: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let delay = 0;
    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / DURATION_MS, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // IntersectionObserver keeps working when images or sections above change the page height, which broke the old scroll trigger
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        delay = window.setTimeout(run, index * 150);
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(delay);
      cancelAnimationFrame(raf);
      setDisplay(value);
    };
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
