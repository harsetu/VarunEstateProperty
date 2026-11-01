import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useHomeViewModel } from '@/features/home/viewmodel/useHomeViewModel';
import { TYPES } from '@/features/properties/data/propertyOptions';
import { HERO_SLIDES } from '@/core/config/heroMedia';
import { AnalyticsEvent } from '@/constants/analytics';
import { analytics } from '@/core/analytics/analytics';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';

const SLIDE_MS = 5500;
const field = 'w-full bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer [&>option]:text-fg';

/** THEME3 home banner: full-width image carousel with a headline per slide and a glass search bar. */
export default function HeroCarousel() {
  const navigate = useNavigate();
  const { sectors } = useHomeViewModel();
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sector, setSector] = useState('All');
  const [type, setType] = useState('All');
  const go = (d: number) => setAt((i) => (i + d + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setAt((i) => (i + 1) % HERO_SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type !== 'All') params.set('type', type);
    if (sector !== 'All') params.set('sector', sector);
    analytics.track(AnalyticsEvent.searchSubmit, { purpose: 'Sale', type, sector });
    navigate(`/properties${params.size ? `?${params}` : ''}`);
  };

  return (
    <section
      className="relative flex flex-col md:block md:h-[100svh] md:min-h-[600px] overflow-hidden md:rounded-b-[2.5rem] bg-night text-white"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Photos are always shown whole (a blurred copy fills any gap), so nothing is cropped on any screen */}
      <div className="relative aspect-[4/3] md:aspect-auto md:absolute md:inset-0">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.image} className={`absolute inset-0 transition-opacity duration-1000 ${i === at ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60" />
            <img src={s.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} className="absolute inset-0 w-full h-full object-contain" />
          </div>
        ))}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-night/60 via-night/15 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 md:h-48 bg-gradient-to-b from-night/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 hidden md:block h-1/2 bg-gradient-to-t from-night/70 to-transparent" />
        <button onClick={() => go(-1)} aria-label={t('heroc.prev')} className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/30 md:bg-white/15 backdrop-blur hover:bg-white/30 flex items-center justify-center">
          <ChevronLeft size={22} />
        </button>
        <button onClick={() => go(1)} aria-label={t('heroc.next')} className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/30 md:bg-white/15 backdrop-blur hover:bg-white/30 flex items-center justify-center">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Headline: under the photo on phones, over it from md up */}
      <div className="relative md:absolute md:inset-0 md:pointer-events-none">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-5 md:pt-0 md:h-full md:flex md:flex-col md:justify-center md:pb-28">
          <div className="grid max-w-xl">
            {HERO_SLIDES.map((s, i) => (
              <div key={s.titleKey} className={`col-start-1 row-start-1 transition-all duration-700 ${i === at ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-gold-light text-xs md:text-sm font-semibold uppercase tracking-[0.18em] mb-2 md:mb-3">{t(s.subtitleKey, { market: flavor.market })}</p>
                <h1 className="font-display italic text-[clamp(1.75rem,6vw,4.75rem)] leading-[1.05]">{t(s.titleKey)}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative md:absolute md:inset-x-0 md:bottom-8 md:z-10 px-5 lg:px-8 py-6 md:py-0 flex flex-col items-center gap-4">
        <form onSubmit={search} className="w-full max-w-3xl grid grid-cols-[1fr_1fr_auto] items-center gap-1 rounded-2xl md:rounded-full bg-white/15 backdrop-blur-md border border-white/25 pl-4 md:pl-6 pr-2 py-2">
          <label className="block pr-3 border-r border-white/25">
            <span className="block text-[0.6875rem] text-white/65">{t('heroc.location')}</span>
            <select value={sector} onChange={(e) => setSector(e.target.value)} className={field}>
              <option value="All">{t('hero.allOf', { market: flavor.market })}</option>
              {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block px-3">
            <span className="block text-[0.6875rem] text-white/65">{t('heroc.type')}</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className={field}>
              <option value="All">{t('hero.anyType')}</option>
              {TYPES.filter((o) => o !== 'All').map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <button type="submit" aria-label={t('hero.search')} className="w-11 h-11 rounded-full bg-gold hover:bg-gold-dark flex items-center justify-center transition-colors">
            <Search size={18} />
          </button>
        </form>
        <div className="flex gap-2">
          {HERO_SLIDES.map((s, i) => (
            <button key={s.image} onClick={() => setAt(i)} aria-label={`${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === at ? 'w-7 bg-gold-light' : 'w-1.5 bg-white/50 hover:bg-white/80'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
