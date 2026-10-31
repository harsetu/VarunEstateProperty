import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Star, ArrowUpRight, Home as HomeIcon } from 'lucide-react';
import { TYPES } from '@/features/properties/data/propertyOptions';
import { CONTACT, whatsappLink } from '@/core/config/contact';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';
import { useHomeViewModel } from '@/features/home/viewmodel/useHomeViewModel';
import { AnalyticsEvent } from '@/constants/analytics';
import { analytics } from '@/core/analytics/analytics';
import { images } from '@/res';

const selectClass =
  'w-full bg-transparent text-fg text-[0.9375rem] font-medium focus:outline-none cursor-pointer';

const AVATARS = ['RS', 'AV', 'MK', 'PM'];

export default function Hero() {
  const navigate = useNavigate();
  const { hero, sectors } = useHomeViewModel();
  const { main: ARCH_MAIN, side: ARCH_SIDE, pill: PILL_IMG, justListed: JUST_LISTED } = hero;
  const collageRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'buy' | 'invest' | 'sell'>('buy');
  const [segment, setSegment] = useState<'residential' | 'commercial'>('residential');
  const [type, setType] = useState('All');
  const residentialTypes = TYPES.filter((o) => o !== 'Commercial');
  const showType = mode === 'buy' && segment === 'residential';
  const [sector, setSector] = useState('All');

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const segmentParam = mode === 'invest' ? 'Investment' : segment === 'commercial' ? 'Commercial' : 'Residential';
    const params = new URLSearchParams({ segment: segmentParam });
    const chosenType = segmentParam === 'Residential' ? type : segmentParam;
    if (segmentParam === 'Residential' && type !== 'All') params.set('type', type);
    if (sector !== 'All') params.set('sector', sector);
    analytics.track(AnalyticsEvent.searchSubmit, { purpose: 'Sale', type: chosenType, sector });
    navigate(`/properties?${params}`);
  };

  // Layers drift with the pointer (not with scroll), each at its own depth
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = collageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty('--my', String((e.clientY - r.top) / r.height - 0.5));
  };

  const depth = (n: number) => ({
    transform: `translate3d(calc(var(--mx, 0) * ${n}px), calc(var(--my, 0) * ${n}px), 0)`,
  });

  return (
    <section
      onPointerMove={onPointerMove}
      className="relative overflow-hidden bg-ink-900 pt-32 lg:pt-36 pb-16 lg:pb-24"
    >
      {/* soft architectural backdrop */}
      <div className="absolute -right-40 top-10 w-[720px] h-[720px] rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(22,23,27,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,23,27,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-10 items-center">
        {/* Left: story + search */}
        <div>
          <p className="hero-in inline-flex items-center gap-2 rounded-full bg-white border border-fg/10 shadow-card px-4 py-1.5 text-ash text-sm mb-7">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t('hero.live', { count: hero.count, market: flavor.market })}
          </p>

          <h1 className="hero-in [animation-delay:80ms] font-display font-semibold text-fg text-[clamp(2.6rem,5.6vw,5rem)] leading-[1.02] tracking-tight">
            {t('hero.titleStart')}{' '}
            <span className="inline-block align-middle w-[1.9em] h-[0.95em] rounded-full overflow-hidden -mt-[0.15em] shadow-card bg-ink-800">
              {PILL_IMG && <img src={PILL_IMG} alt="" className="w-full h-full object-cover" />}
            </span>{' '}
            {rich('hero.titleEnd')}
          </h1>

          <p className="hero-in [animation-delay:160ms] text-ash text-lg mt-6 max-w-xl leading-relaxed">
            {t('hero.subtitle', { market: flavor.market })}
          </p>

          <form
            onSubmit={search}
            className="hero-in [animation-delay:240ms] mt-9 max-w-2xl bg-white rounded-2xl shadow-card-hover border border-fg/5 p-2"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex gap-1 p-1 w-fit bg-ink-800 rounded-full">
                {(['buy', 'invest', 'sell'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      mode === m ? 'bg-fg text-white' : 'text-ash hover:text-fg'
                    }`}
                  >
                    {t(m === 'buy' ? 'hero.buy' : m === 'invest' ? 'hero.invest' : 'hero.sell')}
                  </button>
                ))}
              </div>
              {mode === 'buy' && (
                <div className="flex gap-1 p-1 w-fit bg-ink-800 rounded-full">
                  {(['residential', 'commercial'] as const).map((sg) => (
                    <button
                      key={sg}
                      type="button"
                      onClick={() => { setSegment(sg); setType('All'); }}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        segment === sg ? 'bg-gold text-white' : 'text-ash hover:text-fg'
                      }`}
                    >
                      {t(sg === 'residential' ? 'hero.residential' : 'hero.commercial')}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {mode === 'sell' ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-4">
                <p className="text-ash text-[0.9375rem] flex-1">{t('hero.sellText')}</p>
                <div className="flex gap-2 shrink-0">
                  <Link to="/contact" className="rounded-xl bg-fg hover:bg-gold text-white font-semibold px-6 py-3 transition-colors">
                    {t('hero.sellCta')}
                  </Link>
                  <a
                    href={whatsappLink(t('hero.sellWhatsapp', { company: CONTACT.company }))}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-fg/15 hover:border-gold text-fg font-semibold px-6 py-3 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ) : (
            <div className={`grid grid-cols-1 gap-2 ${showType ? 'sm:grid-cols-[1fr_1fr_auto]' : 'sm:grid-cols-[1fr_auto]'}`}>
              {showType && (
              <label className="rounded-xl px-4 py-3 hover:bg-ink-900 transition-colors">
                <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('hero.propertyType')}</span>
                <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                  {residentialTypes.map((opt) => (
                    <option key={opt} value={opt}>{opt === 'All' ? t('hero.anyType') : opt}</option>
                  ))}
                </select>
              </label>
              )}
              <label className={`rounded-xl px-4 py-3 hover:bg-ink-900 transition-colors ${showType ? 'sm:border-l sm:border-fg/10' : ''}`}>
                <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('hero.location')}</span>
                <select value={sector} onChange={(e) => setSector(e.target.value)} className={selectClass}>
                  {['All', ...sectors].map((s) => (
                    <option key={s} value={s}>{s === 'All' ? t('hero.allOf', { market: flavor.market }) : s}</option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-fg hover:bg-gold text-white font-semibold px-8 py-4 transition-colors"
              >
                <Search size={18} /> {t('hero.search')}
              </button>
            </div>
            )}
          </form>

          <div className="hero-in [animation-delay:320ms] mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {AVATARS.map((a, i) => (
                  <span
                    key={a}
                    className="w-9 h-9 rounded-full border-2 border-ink-900 flex items-center justify-center text-[0.6875rem] font-bold text-white"
                    style={{ background: ['rgb(var(--c-gold))', 'rgb(var(--c-fg))', 'rgb(var(--c-gold-dark))', 'rgb(var(--c-ash))'][i] }}
                  >
                    {a}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <p className="flex items-center gap-1 font-semibold text-fg">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className="text-gold fill-gold" />)}
                </p>
                <p className="text-ash">{t('hero.trusted')}</p>
              </div>
            </div>
            <span className="flex items-center gap-2 text-sm text-ash">
              <ShieldCheck size={18} className="text-gold" /> {t('hero.verified')}
            </span>
          </div>
        </div>

        {/* Right: arch collage */}
        <div ref={collageRef} className="relative h-[460px] sm:h-[560px] lg:h-[620px] hero-in [animation-delay:200ms]">
          <div className="absolute right-0 top-0 w-[72%] h-[88%] transition-transform duration-300 ease-out" style={depth(-18)}>
            <div className="w-full h-full rounded-t-full rounded-b-[2rem] overflow-hidden shadow-card-3d border-[6px] border-white">
              {ARCH_MAIN && <img src={ARCH_MAIN} alt={t('hero.altMain', { market: flavor.market })} className="w-full h-full object-cover scale-110" />}
            </div>
          </div>

          <div className="absolute left-0 bottom-0 w-[44%] h-[52%] transition-transform duration-300 ease-out" style={depth(28)}>
            <div className="w-full h-full rounded-t-full rounded-b-[1.5rem] overflow-hidden shadow-card-3d border-[6px] border-white">
              {ARCH_SIDE && <img src={ARCH_SIDE} alt={t('hero.altSide')} className="w-full h-full object-cover" />}
            </div>
          </div>

          {/* rotating seal */}
          <div className="absolute left-[8%] top-[10%] w-28 h-28 sm:w-32 sm:h-32 transition-transform duration-300 ease-out" style={depth(40)}>
            <div className="relative w-full h-full rounded-full bg-fg text-white shadow-card-3d flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite]">
                <defs>
                  <path id="seal-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                </defs>
                <text fill="currentColor" fontSize="7.4" letterSpacing="1.7" fontWeight="600">
                  <textPath href="#seal-circle">{CONTACT.company.toUpperCase()} • EST. 2008 •</textPath>
                </text>
              </svg>
              <HomeIcon size={26} className="text-gold-light" />
            </div>
          </div>

          {/* just-listed card */}
          {JUST_LISTED && <Link
            to={`/properties/${JUST_LISTED.id}`}
            className="group absolute right-[4%] bottom-[2%] sm:bottom-[6%] w-[62%] sm:w-[270px] flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-white shadow-card-3d p-2.5 pr-4 transition-transform duration-300 ease-out"
            style={depth(52)}
          >
            <img src={JUST_LISTED.images[0] ?? images.placeholder} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-emerald-600">{t('hero.justListed')}</p>
              <p className="text-sm font-semibold text-fg truncate">{JUST_LISTED.title}</p>
              <p className="text-sm font-display font-semibold text-gold">{JUST_LISTED.price}</p>
            </div>
            <ArrowUpRight size={18} className="text-ash group-hover:text-gold transition-colors shrink-0" />
          </Link>}
        </div>
      </div>

      <style>{`
        .hero-in { animation: heroIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .is-loading .hero-in { animation-play-state: paused; }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}
