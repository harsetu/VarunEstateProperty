import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck } from 'lucide-react';
import { TYPES } from '@/features/properties/data/propertyOptions';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';
import { useHomeViewModel } from '@/features/home/viewmodel/useHomeViewModel';
import { AnalyticsEvent } from '@/constants/analytics';
import { analytics } from '@/core/analytics/analytics';

const selectClass =
  'w-full bg-transparent text-fg text-[0.9375rem] font-medium focus:outline-none cursor-pointer';

export default function Hero() {
  const navigate = useNavigate();
  const { hero, sectors } = useHomeViewModel();
  const { main: ARCH_MAIN } = hero;
  const [purpose, setPurpose] = useState<'Sale' | 'Rent'>('Sale');
  const [type, setType] = useState('All');
  const [sector, setSector] = useState('All');

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ purpose });
    if (type !== 'All') params.set('type', type);
    if (sector !== 'All') params.set('sector', sector);
    analytics.track(AnalyticsEvent.searchSubmit, { purpose, type, sector });
    navigate(`/properties?${params}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-night min-h-[100svh] flex flex-col">
      {/* full-bleed photo under a top-to-bottom shade */}
      {ARCH_MAIN && <img src={ARCH_MAIN} alt={t('hero.altMain', { market: flavor.market })} className="hero-kenburns absolute inset-0 -z-20 w-full h-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/45 to-black/80" />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-5 lg:px-8 pt-40 pb-10 max-w-[1100px] mx-auto w-full">
        <h1 className="hero-in font-display font-bold uppercase text-white text-[clamp(2rem,5vw,4rem)] leading-tight tracking-wide [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
          {t('hero.titleStart')}{' '}
          <span className="hero-write block font-script font-normal normal-case text-[clamp(3.25rem,9vw,7rem)] leading-[0.8] mt-2">
            {rich('hero.titleEnd', undefined, 'not-italic text-white')}
          </span>
        </h1>

        <p className="hero-in [animation-delay:120ms] text-white/90 text-lg mt-8 max-w-2xl leading-relaxed">
          {t('hero.subtitle', { market: flavor.market })}
        </p>

        <form
          onSubmit={search}
          className="hero-in [animation-delay:240ms] mt-10 w-full max-w-3xl rounded-xl bg-white/95 backdrop-blur-md shadow-card-3d p-3 text-left"
        >
          <div className="flex gap-1 mb-3" role="tablist" aria-label={t('hero.search')}>
            {(['Sale', 'Rent'] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={purpose === p}
                onClick={() => setPurpose(p)}
                className={`min-h-[44px] px-6 rounded-lg text-sm font-bold transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  purpose === p ? 'bg-fg text-white' : 'text-ash-light hover:bg-ink-800'
                }`}
              >
                {p === 'Sale' ? t('hero.buy') : t('hero.rent')}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
            <label className="rounded-lg px-4 py-2.5 bg-ink-900 border border-fg/10 focus-within:ring-2 focus-within:ring-gold cursor-pointer">
              <span className="block text-xs font-bold text-ash uppercase tracking-wider mb-0.5">{t('hero.propertyType')}</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                {TYPES.map((opt) => (
                  <option key={opt} value={opt}>{opt === 'All' ? t('hero.anyType') : opt}</option>
                ))}
              </select>
            </label>
            <label className="rounded-lg px-4 py-2.5 bg-ink-900 border border-fg/10 focus-within:ring-2 focus-within:ring-gold cursor-pointer">
              <span className="block text-xs font-bold text-ash uppercase tracking-wider mb-0.5">{t('hero.location')}</span>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className={selectClass}>
                {['All', ...sectors].map((s) => (
                  <option key={s} value={s}>{s === 'All' ? t('hero.allOf', { market: flavor.market }) : s}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-gold-dark hover:bg-gold-deep text-white font-bold px-9 py-3.5 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Search size={18} aria-hidden="true" /> {t('hero.search')}
            </button>
          </div>
        </form>
      </div>

      <a
        href="#browse"
        aria-label="Scroll down"
        className="hero-in [animation-delay:600ms] absolute bottom-24 left-1/2 -translate-x-1/2 hidden [@media(min-height:940px)]:flex h-11 w-7 justify-center rounded-full border-2 border-white/60 pt-2"
      >
        <span className="hero-wheel block h-2 w-1 rounded-full bg-white" />
      </a>

      {/* stat strip, separated by thin dividers */}
      <div className="hero-in [animation-delay:360ms] border-t border-white/15 bg-black/30 backdrop-blur-sm">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-8 grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-white/20 text-center text-white">
          <p className="py-5 font-bold tracking-wide">{t('hero.live', { count: hero.count, market: flavor.market })}</p>
          <p className="py-5 font-bold tracking-wide">{t('hero.trusted')}</p>
          <p className="py-5 font-bold tracking-wide flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-gold-light" aria-hidden="true" /> {t('hero.verified')}
          </p>
        </div>
      </div>

      <style>{`
        .hero-in { animation: heroIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .is-loading .hero-in { animation-play-state: paused; }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
        .hero-kenburns { animation: kenburns 18s ease-out both; }
        @keyframes kenburns { from { transform: scale(1.12); } to { transform: scale(1); } }
        .hero-write { animation: heroWrite 1.6s 0.5s cubic-bezier(0.65, 0, 0.35, 1) both; }
        @keyframes heroWrite { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 -2% 0 0); } }
        .hero-wheel { animation: wheel 1.6s ease-in-out infinite; }
        @keyframes wheel { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(14px); opacity: 0; } 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .hero-in, .hero-kenburns, .hero-write, .hero-wheel { animation: none; }
        }
      `}</style>
    </section>
  );
}
