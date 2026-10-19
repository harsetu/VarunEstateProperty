import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  /** Direction the content travels in from. */
  from?: 'up' | 'left' | 'right' | 'scale';
}

// A gentle one-time fade-up as content enters the viewport. Never tied to
// scroll position, so it doesn't fight the user's scrolling.
export default function ScrollReveal({ children, className = '', delay = 0, y = 40, from = 'up' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const start = from === 'left' ? { x: -y * 1.5 } : from === 'right' ? { x: y * 1.5 } : from === 'scale' ? { scale: 0.94, y: y / 2 } : { y };
      gsap.from(el, {
        opacity: 0,
        ...start,
        duration: 0.95,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, y, from]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
