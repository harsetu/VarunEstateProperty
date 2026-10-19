import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ArrowUpDown, MapPin, MessageCircle, SearchX, LayoutGrid, Tag } from 'lucide-react';
import { LABELS, type Label } from '@/features/properties/model/property';
import { TYPES } from '@/features/properties/data/propertyOptions';
import { useListingsViewModel, SORT_LABELS as SORTS } from '@/features/properties/viewmodel/useListingsViewModel';
import { CONTACT, whatsappLink } from '@/core/config/contact';
import flavor from '@/flavors';
import PropertyCard from '@/features/properties/ui/PropertyCard';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { t } from '@/core/utils/i18n';

const PURPOSE_TABS = [
  { value: 'All', label: t('listings.all') },
  { value: 'Sale', label: t('listings.buy') },
  { value: 'Rent', label: t('listings.rent') },
];


export default function Properties() {
  const { status, error, reload, sectors, type, sector, purpose, label, sort, results, total, page, totalPages, setPage, setFilter: update, clearAll } = useListingsViewModel();

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeChips = [
    purpose !== 'All' && { label: purpose === 'Sale' ? t('listings.forSale') : t('listings.forRent'), clear: () => update('purpose', 'All', 'All') },
    type !== 'All' && { label: type, clear: () => update('type', 'All', 'All') },
    sector !== 'All' && { label: sector, clear: () => update('sector', 'All', 'All') },
    label !== 'All' && { label: t(`label.${label as Label}`), clear: () => update('label', 'All', 'All') },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const typeLabel = type === 'All' ? t('listings.typeAll') : type === 'Commercial' ? t('listings.typeCommercial') : t('listings.typePlural', { type });
  const heading = t(purpose === 'Rent' ? 'listings.headingRent' : purpose === 'Sale' ? 'listings.headingSale' : 'listings.heading', { type: typeLabel });

  // Slot a "can't find it?" card into the grid
  const ctaAt = Math.min(4, results.length);

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      {/* Header */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-6 pb-3">
        <ScrollReveal>
          <p className="text-gold text-xs font-semibold uppercase tracking-[0.18em] mb-1">{t('listings.eyebrow')}</p>
          <h1 className="font-display font-semibold text-fg text-[clamp(1.6rem,3vw,2.4rem)] leading-tight tracking-tight">
            {t('listings.headingIn', { heading, place: sector === 'All' ? flavor.market : sector })}
          </h1>
          <p className="text-ash text-sm mt-1">
            {t(total === 1 ? 'listings.countOne' : 'listings.countMany', { count: total })}
          </p>
        </ScrollReveal>
      </section>

      {/* Filter bar */}
      <div className={`sticky top-[72px] z-40 transition-[background,box-shadow] duration-300 ${scrolled ? 'bg-ink-900/90 backdrop-blur-xl shadow-[0_1px_0_rgba(22,23,27,0.08)]' : ''}`}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-2">
          <div className="flex items-center gap-2 overflow-x-auto -mx-5 px-5 lg:mx-0 lg:px-0 lg:overflow-visible lg:flex-wrap [scrollbar-width:none] [&>*]:shrink-0">
            {/* Buy / Rent */}
            <div className="flex p-0.5 bg-white rounded-full shadow-card">
              {PURPOSE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => update('purpose', tab.value, 'All')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    purpose === tab.value ? 'bg-fg text-white' : 'text-ash hover:text-fg'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Type */}
            <label className="flex items-center gap-1.5 bg-white rounded-full shadow-card pl-3 pr-2 py-1 text-xs">
              <LayoutGrid size={13} className="text-gold" />
              <select
                value={type}
                onChange={(e) => update('type', e.target.value, 'All')}
                className="bg-transparent font-medium text-fg focus:outline-none cursor-pointer"
                aria-label={t('listings.allTypes')}
              >
                {TYPES.map((opt) => <option key={opt} value={opt}>{opt === 'All' ? t('listings.allTypes') : opt}</option>)}
              </select>
            </label>

            {/* Sector */}
            <label className="flex items-center gap-1.5 bg-white rounded-full shadow-card pl-3 pr-2 py-1 text-xs">
              <MapPin size={13} className="text-gold" />
              <select
                value={sector}
                onChange={(e) => update('sector', e.target.value, 'All')}
                className="bg-transparent font-medium text-fg focus:outline-none cursor-pointer"
                aria-label={t('listings.sector')}
              >
                {sectors.map((s) => <option key={s} value={s}>{s === 'All' ? t('listings.allSectors') : s}</option>)}
              </select>
            </label>

            {/* Label */}
            <label className="flex items-center gap-1.5 bg-white rounded-full shadow-card pl-3 pr-2 py-1 text-xs">
              <Tag size={13} className="text-gold" />
              <select
                value={label}
                onChange={(e) => update('label', e.target.value, 'All')}
                className="bg-transparent font-medium text-fg focus:outline-none cursor-pointer"
                aria-label={t('listings.label')}
              >
                <option value="All">{t('listings.allLabels')}</option>
                {LABELS.map((l) => <option key={l} value={l}>{t(`label.${l}`)}</option>)}
              </select>
            </label>

            {/* Sort */}
            <label className="flex items-center gap-1.5 bg-white rounded-full shadow-card pl-3 pr-2 py-1 text-xs lg:ml-auto">
              <ArrowUpDown size={13} className="text-gold" />
              <select
                value={sort}
                onChange={(e) => update('sort', e.target.value, 'recommended')}
                className="bg-transparent font-medium text-fg focus:outline-none cursor-pointer"
                aria-label={t('listings.sort')}
              >
                {Object.entries(SORTS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-4 pb-20 lg:pb-28">
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-ash mr-1">{t('listings.showing')}</span>
            {activeChips.map((c) => (
              <button key={c.label} onClick={c.clear} className="flex items-center gap-1.5 rounded-full bg-gold/10 text-fg text-sm font-medium pl-3 pr-2 py-1 hover:bg-gold/20">
                {c.label} <X size={14} />
              </button>
            ))}
            <button onClick={clearAll} className="text-sm text-gold font-semibold ml-1 hover:underline">{t('listings.clearAll')}</button>
          </div>
        )}

        {status === 'loading' ? (
          <p className="text-center text-ash py-16">{t('listings.loading')}</p>
        ) : status === 'error' ? (
          <div className="text-center py-16">
            <p className="text-ash mb-4">{t('listings.loadError', { detail: error ? ` (${error})` : '' })}</p>
            <button onClick={reload} className="neopop-btn neopop-btn-outline">{t('listings.retry')}</button>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="mx-auto w-32 h-40 rounded-t-full rounded-b-2xl border-2 border-dashed border-gold/40 flex items-center justify-center mb-6">
              <SearchX size={36} className="text-gold" />
            </div>
            <h2 className="font-display font-semibold text-fg text-2xl">{t('listings.emptyTitle')}</h2>
            <p className="text-ash mt-2">
              {t('listings.emptyBody')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a
                href={whatsappLink(t('listings.alertMsg', { company: CONTACT.company, what: activeChips.map((c) => c.label).join(', ') || t('listings.aProperty'), market: flavor.market }))}
                target="_blank"
                rel="noreferrer"
                className="neopop-btn !bg-[#25D366] !border-[#25D366]"
              >
                <MessageCircle size={16} /> {t('listings.alertMe')}
              </a>
              <button onClick={clearAll} className="neopop-btn neopop-btn-outline">{t('listings.clearFilters')}</button>
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

        {status === 'ready' && totalPages > 1 && (
          <nav aria-label={t('listings.pagination')} className="flex items-center justify-center gap-3 mt-12">
            <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="neopop-btn neopop-btn-outline disabled:opacity-40">
              <ChevronLeft size={16} /> {t('listings.prev')}
            </button>
            <span className="text-sm text-ash">{t('listings.pageOf', { page, total: totalPages })}</span>
            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="neopop-btn neopop-btn-outline disabled:opacity-40">
              {t('listings.next')} <ChevronRight size={16} />
            </button>
          </nav>
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
        <p className="relative text-gold-light text-xs font-semibold uppercase tracking-[0.18em]">{t('listings.offMarket')}</p>
        <h3 className="relative font-display font-semibold text-3xl leading-tight mt-2">{t('listings.notFoundTitle')}</h3>
        <p className="relative text-white/70 mt-3 leading-relaxed">
          {t('listings.notFoundBody')}
        </p>
        <a
          href={whatsappLink(t('listings.offMarketMsg', { company: CONTACT.company }))}
          target="_blank"
          rel="noreferrer"
          className="relative neopop-btn neopop-btn-dark mt-6 w-fit"
        >
          <MessageCircle size={16} /> {t('listings.share')}
        </a>
      </div>
    </ScrollReveal>
  );
}
