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
      className="relative h-[100svh] min-h-[600px] overflow-hidden rounded-b-[2.5rem] bg-night text-white"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt=""
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === at ? 'opacity-100 animate-kenburns' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-night/75 via-night/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-night/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/70 to-transparent" />

      <div className="relative h-full max-w-[1280px] mx-auto px-5 lg:px-8 flex flex-col justify-center pb-28">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.titleKey} className={`absolute max-w-xl transition-all duration-700 ${i === at ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.18em] mb-3">{t(s.subtitleKey, { market: flavor.market })}</p>
            <h1 className="font-display italic text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.05]">{t(s.titleKey)}</h1>
          </div>
        ))}
      </div>

      <button onClick={() => go(-1)} aria-label={t('heroc.prev')} className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur hover:bg-white/30 flex items-center justify-center">
        <ChevronLeft size={22} />
      </button>
      <button onClick={() => go(1)} aria-label={t('heroc.next')} className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur hover:bg-white/30 flex items-center justify-center">
        <ChevronRight size={22} />
      </button>

      <div className="absolute inset-x-0 bottom-8 px-5 lg:px-8 flex flex-col items-center gap-4">
        <form onSubmit={search} className="w-full max-w-3xl grid grid-cols-[1fr_1fr_auto] items-center gap-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 pl-6 pr-2 py-2">
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
