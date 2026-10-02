import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, ArrowUpDown, MapPin, MessageCircle, SearchX, LayoutGrid } from 'lucide-react';
import { PROPERTIES, SECTORS, TYPES, CATEGORIES } from '@/data/properties';
import { whatsappLink } from '@/data/contact';
import PropertyCard from '@/components/PropertyCard';
import ScrollReveal from '@/components/ScrollReveal';

const SORTS = {
  recommended: 'Recommended',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
} as const;
type SortKey = keyof typeof SORTS;

const PURPOSE_TABS = [
  { value: 'All', label: 'All' },
  { value: 'Sale', label: 'Buy' },
  { value: 'Rent', label: 'Rent' },
];

const TYPE_IMAGE = Object.fromEntries(CATEGORIES.map((c) => [c.name, c.image]));

export default function Properties() {
  // Filters live in the URL so results can be shared and survive back/forward
  const [params, setParams] = useSearchParams();
  const pick = (key: string, options: readonly string[], fallback: string) => {
    const v = params.get(key);
    return v && options.includes(v) ? v : fallback;
  };
  const type = pick('type', TYPES, 'All');
  const sector = pick('sector', SECTORS, 'All');
  const purpose = pick('purpose', ['All', 'Sale', 'Rent'], 'All');
  const sort = pick('sort', Object.keys(SORTS), 'recommended') as SortKey;

  const update = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const results = useMemo(() => {
    const list = PROPERTIES.filter((p) =>
      (type === 'All' || p.type === type) &&
      (sector === 'All' || p.sector === sector) &&
      (purpose === 'All' || p.purpose === purpose),
    );
    if (sort === 'price-asc') return [...list].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.priceValue - a.priceValue);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [type, sector, purpose, sort]);

  const activeChips = [
    purpose !== 'All' && { label: purpose === 'Sale' ? 'For sale' : 'For rent', clear: () => update('purpose', 'All', 'All') },
    type !== 'All' && { label: type, clear: () => update('type', 'All', 'All') },
    sector !== 'All' && { label: sector, clear: () => update('sector', 'All', 'All') },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const typeLabel = type === 'All' ? 'Properties' : type === 'Commercial' ? 'Commercial spaces' : `${type}s`;
  const heading = `${typeLabel}${purpose === 'Rent' ? ' for rent' : purpose === 'Sale' ? ' for sale' : ''}`;

  // Slot a "can't find it?" card into the grid
  const ctaAt = Math.min(4, results.length);

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-32 -top-20 w-[560px] h-[560px] rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-10 pb-10 lg:pb-14 grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <ScrollReveal>
            <p className="text-gold text-sm font-semibold uppercase tracking-[0.18em] mb-3">Our portfolio</p>
            <h1 className="font-display font-semibold text-fg text-[clamp(2.4rem,5vw,4.25rem)] leading-[1.05] tracking-tight">
              {heading} in <em className="text-gold">{sector === 'All' ? 'Panchkula' : sector}</em>
            </h1>
            <p className="text-ash text-lg mt-4 max-w-xl">
              {results.length} verified {results.length === 1 ? 'listing' : 'listings'} — every one inspected and title-checked by our team.
            </p>
          </ScrollReveal>

          <div className="hidden lg:flex items-end gap-3" aria-hidden>
            {CATEGORIES.slice(0, 3).map((c, i) => (
              <div
                key={c.name}
                className="w-28 rounded-t-full rounded-b-2xl overflow-hidden border-4 border-white shadow-card-hover"
                style={{ height: [150, 190, 130][i] }}
              >
                <img src={c.image} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className={`sticky top-[72px] z-40 transition-[background,box-shadow] duration-300 ${scrolled ? 'bg-ink-900/90 backdrop-blur-xl shadow-[0_1px_0_rgba(22,23,27,0.08)]' : ''}`}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0 lg:overflow-visible lg:flex-wrap [scrollbar-width:none] [&>*]:shrink-0">
            {/* Buy / Rent */}
            <div className="flex p-1 bg-white rounded-full shadow-card">
              {PURPOSE_TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => update('purpose', t.value, 'All')}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    purpose === t.value ? 'bg-fg text-white' : 'text-ash hover:text-fg'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sector */}
            <label className="relative flex items-center gap-2 bg-white rounded-full shadow-card pl-4 pr-3 py-2 text-sm">
              <MapPin size={15} className="text-gold" />
              <select
                value={sector}
                onChange={(e) => update('sector', e.target.value, 'All')}
                className="bg-transparent font-medium text-fg focus:outline-none cursor-pointer pr-1"
                aria-label="Sector"
              >
                {SECTORS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All sectors' : s}</option>)}
              </select>
            </label>

            {/* Sort */}
            <label className="relative flex items-center gap-2 bg-white rounded-full shadow-card pl-4 pr-3 py-2 text-sm lg:ml-auto">
              <ArrowUpDown size={15} className="text-gold" />
              <select
                value={sort}
                onChange={(e) => update('sort', e.target.value, 'recommended')}
                className="bg-transparent font-medium text-fg focus:outline-none cursor-pointer pr-1"
                aria-label="Sort"
              >
                {Object.entries(SORTS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
              </select>
            </label>
          </div>

          {/* Type pills with photos */}
          <div className="flex gap-2 mt-2.5 lg:mt-3 overflow-x-auto pb-1 -mx-5 px-5 lg:mx-0 lg:px-0 [scrollbar-width:none]">
            {TYPES.map((t) => {
              const on = type === t;
              return (
                <button
                  key={t}
                  onClick={() => update('type', t, 'All')}
                  className={`shrink-0 flex items-center gap-2 rounded-full pl-1 pr-4 py-1 text-sm font-medium border transition-all ${
                    on ? 'bg-fg text-white border-fg shadow-card-hover' : 'bg-white/70 text-ash border-fg/10 hover:bg-white hover:text-fg'
                  }`}
                >
                  {t === 'All' ? (
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center ${on ? 'bg-white/15' : 'bg-ink-800'}`}>
                      <LayoutGrid size={14} />
                    </span>
                  ) : (
                    <img src={TYPE_IMAGE[t]} alt="" className="w-7 h-7 rounded-full object-cover" />
                  )}
                  {t === 'All' ? 'All types' : t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-6 pb-20 lg:pb-28">
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-ash mr-1">Showing</span>
            {activeChips.map((c) => (
              <button key={c.label} onClick={c.clear} className="flex items-center gap-1.5 rounded-full bg-gold/10 text-fg text-sm font-medium pl-3 pr-2 py-1 hover:bg-gold/20">
                {c.label} <X size={14} />
              </button>
            ))}
            <button onClick={clearAll} className="text-sm text-gold font-semibold ml-1 hover:underline">Clear all</button>
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="mx-auto w-32 h-40 rounded-t-full rounded-b-2xl border-2 border-dashed border-gold/40 flex items-center justify-center mb-6">
              <SearchX size={36} className="text-gold" />
            </div>
            <h2 className="font-display font-semibold text-fg text-2xl">Nothing listed here — yet</h2>
            <p className="text-ash mt-2">
              Many of our best properties sell before they're ever listed. Tell us what you want and we'll alert you first.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a
                href={whatsappLink(`Hi Varun Estate, I'm looking for: ${activeChips.map((c) => c.label).join(', ') || 'a property'} in Panchkula.`)}
                target="_blank"
                rel="noreferrer"
                className="neopop-btn !bg-[#25D366] !border-[#25D366]"
              >
                <MessageCircle size={16} /> Alert me on WhatsApp
              </a>
              <button onClick={clearAll} className="neopop-btn neopop-btn-outline">Clear filters</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((p, i) => (
              <div key={p.id} className="contents">
                {i === ctaAt && <FindCta />}
                <PropertyCard property={p} index={i % 3} />
              </div>
            ))}
            {ctaAt === results.length && <FindCta />}
          </div>
        )}
      </section>
    </div>
  );
}

function FindCta() {
  return (
    <ScrollReveal className="h-full">
      <div className="relative h-full min-h-[380px] rounded-t-[200px] rounded-b-2xl overflow-hidden bg-night text-white p-8 flex flex-col justify-end shadow-card-3d">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gold/25 blur-[80px]" />
        <p className="relative text-gold-light text-xs font-semibold uppercase tracking-[0.18em]">Off-market</p>
        <h3 className="relative font-display font-semibold text-3xl leading-tight mt-2">Didn't find the one?</h3>
        <p className="relative text-white/70 mt-3 leading-relaxed">
          Tell us your budget and sector — we'll share matching properties that aren't on the website.
        </p>
        <a
          href={whatsappLink('Hi Varun Estate, please share off-market properties. My budget is ___ and preferred sector is ___.')}
          target="_blank"
          rel="noreferrer"
          className="relative neopop-btn neopop-btn-dark mt-6 w-fit"
        >
          <MessageCircle size={16} /> Share my requirement
        </a>
      </div>
    </ScrollReveal>
  );
}
