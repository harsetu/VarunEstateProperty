import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { tick, unlockAudio } from '@/core/audio/sfx';
import flavor from '@/flavors';
import { CONTACT } from '@/core/config/contact';
import { t } from '@/core/utils/i18n';

export const CELEBRATE_KEY = 'launch-celebrate';
const COUNTDOWN = 5;
const RING = 2 * Math.PI * 140;

/** /launch: the pre-launch screen. "Launch" starts a big 5-second countdown, then lands on the home page with fireworks. */
export default function LaunchPage() {
  const navigate = useNavigate();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      try { sessionStorage.setItem(CELEBRATE_KEY, '1'); } catch { /* the show is only a bonus */ }
      navigate('/', { replace: true });
      return;
    }
    tick(count === 1);
    const id = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(id);
  }, [count, navigate]);

  const counting = count !== null;

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#0A0B0F] text-white flex flex-col items-center px-5">
      {/* Backdrop: soft gold glows over a faint grid */}
      <div aria-hidden className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gold/25 blur-[140px] animate-float" />
      <div aria-hidden className="absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full bg-orange-500/15 blur-[120px] animate-float [animation-delay:-4s]" />

      {/* Developer credit, topmost */}
      <p className="relative z-10 mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-xs sm:text-sm text-white/70">
        {t('launch.developedBy')} <span className="font-semibold text-gold-light">{t('launch.developer')}</span>
      </p>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center w-full pb-10">
        {flavor.logo && (
          <img src={flavor.logo} alt={CONTACT.company} className="launch-rise w-20 h-20 sm:w-28 sm:h-28 rounded-3xl object-contain shadow-[0_0_60px_rgba(242,176,30,0.35)] mb-6" />
        )}
        <h1 className="launch-rise [animation-delay:120ms] font-display font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(4.5rem,22vw,15rem)] bg-gradient-to-b from-white via-gold-light to-gold bg-clip-text text-transparent">
          {t('launch.name')}
        </h1>
        <p className="launch-rise [animation-delay:240ms] mt-3 text-[clamp(1rem,3.2vw,2rem)] font-semibold uppercase tracking-[0.5em] text-white/80 pl-[0.5em]">
          {t('launch.kind')}
        </p>
        <p className="launch-rise [animation-delay:360ms] mt-6 text-base sm:text-xl text-white/60 max-w-md">{t('launch.tagline')}</p>

        <button
          onClick={() => { unlockAudio(); setCount(COUNTDOWN); }}
          disabled={counting}
          className="launch-rise [animation-delay:480ms] group relative mt-12 inline-flex items-center gap-3 rounded-full bg-gold hover:bg-gold-light text-night font-bold text-lg sm:text-xl uppercase tracking-widest px-12 py-5 shadow-[0_0_50px_rgba(242,176,30,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-0"
        >
          <span aria-hidden className="absolute inset-0 rounded-full bg-gold/60 animate-ping [animation-duration:2s]" />
          <Rocket size={22} className="relative -rotate-45 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          <span className="relative">{t('launch.button')}</span>
        </button>
      </div>

      {/* Countdown: a big ring that fills over five seconds */}
      {counting && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0B0F]/90 backdrop-blur-md">
          <div className="relative w-[min(78vw,420px)] aspect-square">
            <span aria-hidden className="absolute inset-0 rounded-full bg-gold/20 blur-3xl animate-pulse" />
            <svg viewBox="0 0 320 320" className="relative w-full h-full -rotate-90">
              <circle cx="160" cy="160" r="140" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
              <circle
                cx="160" cy="160" r="140" fill="none" stroke="#F2B01E" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={RING} strokeDashoffset={RING}
                style={{ animation: `launch-ring ${COUNTDOWN}s linear forwards` }}
              />
            </svg>
            <span key={count} className="launch-pop absolute inset-0 flex items-center justify-center font-display font-extrabold text-gold-light text-[clamp(7rem,38vw,15rem)] leading-none [font-variant-numeric:lining-nums_tabular-nums] pb-[0.06em]">
              {count}
            </span>
          </div>
          <p className="mt-8 text-white/60 uppercase tracking-[0.35em] text-sm">{t('launch.starting')}</p>
        </div>
      )}
    </main>
  );
}
