import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CONTACT } from '@/data/contact';
import { LogoMark } from '@/components/Logo';

const TYPES = ['Kothis', 'Plots', 'Builder Floors', 'Flats', 'Commercial'];

// Dark intro screen shown on first load, then slides up to reveal the page.
// While it is up, <html> carries .is-loading so the hero's entrance
// animations wait and play as the screen lifts.
export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      html.classList.remove('is-loading');
      document.body.style.overflow = '';
      setDone(true);
      onComplete?.();
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    html.classList.add('is-loading');
    document.body.style.overflow = 'hidden';

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.from('.pl-mark', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(1.6)' })
        .from('.pl-letter', { yPercent: 110, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out' }, 0.3)
        .from('.pl-fade', { opacity: 0, y: 10, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, 0.8)
        .to(counter, {
          v: 100,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate: () => setPercent(Math.round(counter.v)),
        }, 0.2)
        .to('.pl-bar', { scaleX: 1, duration: 1.8, ease: 'power1.inOut' }, 0.2)
        .to('.pl-content', { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, '+=0.15')
        .add(() => html.classList.remove('is-loading'))
        .to(root, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.1');
    }, root);

    const fallback = setTimeout(finish, 6000);
    return () => {
      clearTimeout(fallback);
      ctx.revert();
      html.classList.remove('is-loading');
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[10000] bg-night text-white overflow-hidden">
      {/* soft gold glow + faint grid for depth */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gold/15 blur-[140px]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="pl-content relative h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="pl-mark mb-6"><LogoMark size={84} tone="light" /></div>

        <h1 className="font-brand font-bold text-[clamp(1.75rem,5.5vw,3.5rem)] leading-tight tracking-[0.02em] flex flex-wrap justify-center overflow-hidden pb-2">
          {'PAHWA REAL ESTATE'.split('').map((ch, i) => (
            <span key={i} className={`pl-letter inline-block ${i > 5 ? 'text-[#F2B01E]' : ''}`}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h1>

        <p className="pl-fade mt-4 text-white/70 text-sm sm:text-base tracking-wide">
          {CONTACT.tagline}
        </p>

        <div className="pl-fade mt-6 flex flex-wrap justify-center gap-2">
          {TYPES.map((t) => (
            <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
              {t}
            </span>
          ))}
        </div>

        <div className="pl-fade mt-12 w-56">
          <div className="h-px bg-white/15 overflow-hidden">
            <div className="pl-bar h-full bg-gold-light origin-left" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-white/50 tabular-nums">
            <span>Finding your home</span>
            <span>{percent}%</span>
          </div>
        </div>
      </div>

      <p className="pl-fade absolute bottom-8 inset-x-0 text-center text-xs text-white/40">
        {CONTACT.addressShort} · {CONTACT.phoneDisplay}
      </p>
    </div>
  );
}
