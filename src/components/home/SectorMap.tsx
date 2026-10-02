import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { PROPERTIES, SECTOR_INFO, formatINR } from '@/data/properties';
import { whatsappLink } from '@/data/contact';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';

// Illustrative layout only — not to scale.
const TILES: { id: string; label: string; col: number; row: number; w?: number; h?: number }[] = [
  { id: 'MDC', label: 'MDC', col: 1, row: 1, w: 2, h: 2 },
  { id: 'Sector 1', label: '1', col: 3, row: 1 },
  { id: 'Sector 2', label: '2', col: 4, row: 1 },
  { id: 'Sector 4', label: '4', col: 5, row: 1, w: 2 },
  { id: 'Sector 5', label: '5', col: 3, row: 2 },
  { id: 'Sector 6', label: '6', col: 4, row: 2 },
  { id: 'Sector 7', label: '7', col: 5, row: 2 },
  { id: 'Sector 8', label: '8', col: 6, row: 2 },
  { id: 'Sector 9', label: '9', col: 1, row: 3 },
  { id: 'Sector 10', label: '10', col: 2, row: 3 },
  { id: 'Sector 11', label: '11', col: 3, row: 3, w: 2 },
  { id: 'Sector 12', label: '12', col: 5, row: 3 },
  { id: 'Sector 15', label: '15', col: 6, row: 3 },
  { id: 'Sector 16', label: '16', col: 1, row: 4 },
  { id: 'Sector 17', label: '17', col: 2, row: 4 },
  { id: 'Sector 20', label: '20', col: 3, row: 4, w: 2 },
  { id: 'Sector 21', label: '21', col: 5, row: 4 },
  { id: 'Sector 25', label: '25', col: 6, row: 4 },
];

export default function SectorMap() {
  const bySector = useMemo(() => {
    const map = new Map<string, typeof PROPERTIES>();
    PROPERTIES.forEach((p) => map.set(p.sector, [...(map.get(p.sector) ?? []), p]));
    return map;
  }, []);

  const firstActive = TILES.find((t) => bySector.has(t.id))?.id ?? TILES[0].id;
  const [active, setActive] = useState(firstActive);

  const listings = bySector.get(active) ?? [];
  const info = SECTOR_INFO[active];
  // Quote the cheapest sale price; fall back to rent if the sector only has rentals
  const priced = listings.some((p) => p.purpose === 'Sale') ? listings.filter((p) => p.purpose === 'Sale') : listings;
  const fromPrice = priced.length ? formatINR(Math.min(...priced.map((p) => p.priceValue))) : null;
  const types = [...new Set(listings.map((p) => p.type))];

  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8 bg-ink-800 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading
          eyebrow="Explore by sector"
          title={<>Know the neighbourhood <em className="text-gold">before</em> you visit</>}
          subtitle="Tap a sector to see what's available, starting prices and what it's like to live there."
        />

        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Map */}
          <ScrollReveal>
            <div className="relative lg:py-4 lg:px-6 [perspective:1600px]">
              <div className="iso-map grid grid-cols-6 grid-rows-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-[1.75rem] bg-[#E9E3D6] shadow-card-3d">
                {TILES.map((t) => {
                  const count = bySector.get(t.id)?.length ?? 0;
                  const isActive = active === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActive(t.id)}
                      aria-pressed={isActive}
                      aria-label={`${t.id}${count ? `, ${count} listings` : ''}`}
                      style={{ gridColumn: `${t.col} / span ${t.w ?? 1}`, gridRow: `${t.row} / span ${t.h ?? 1}` }}
                      className={`iso-tile relative aspect-square min-h-0 rounded-xl text-left transition-all duration-300 ${
                        t.w || t.h ? '!aspect-auto' : ''
                      } ${
                        isActive
                          ? 'bg-gold text-white iso-raised'
                          : count
                            ? 'bg-white text-fg hover:bg-gold/15 iso-lift'
                            : 'bg-white/45 text-ash-dark hover:bg-white/70'
                      }`}
                    >
                      <span className={`absolute left-2 top-1.5 sm:left-3 sm:top-2 font-display font-semibold ${t.id === 'MDC' ? 'text-lg sm:text-2xl' : 'text-sm sm:text-lg'}`}>
                        {t.label}
                      </span>
                      {count > 0 && (
                        <span className="iso-pin absolute right-1.5 bottom-1.5 sm:right-2.5 sm:bottom-2.5">
                          <span className={`flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1 rounded-full text-[0.6875rem] font-bold shadow ${
                            isActive ? 'bg-white text-gold' : 'bg-fg text-white'
                          }`}>
                            {count}
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 lg:mt-10 text-xs text-ash-dark text-center lg:text-left">
                Illustrative map, not to scale · Numbers show live listings
              </p>
            </div>
          </ScrollReveal>

          {/* Detail panel */}
          <div key={active} className="animate-[panelIn_0.45s_cubic-bezier(0.22,1,0.36,1)]">
            <p className="flex items-center gap-1.5 text-gold text-sm font-semibold uppercase tracking-[0.18em]">
              <MapPin size={15} /> Panchkula
            </p>
            <h3 className="font-display font-semibold text-fg text-4xl mt-2">
              {active === 'MDC' ? 'Mansa Devi Complex' : active}
            </h3>
            <p className="text-ash leading-relaxed mt-3">
              {info?.vibe ?? 'We don’t have a listing here right now — but we often hear about properties before they’re public.'}
            </p>

            {info && (
              <div className="flex flex-wrap gap-2 mt-4">
                {info.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white border border-fg/10 px-3 py-1 text-xs font-medium text-fg">{tag}</span>
                ))}
              </div>
            )}

            {listings.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-card">
                    <p className="text-xs text-ash-dark">Listings</p>
                    <p className="font-display font-semibold text-fg text-xl sm:text-2xl">{listings.length}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-card">
                    <p className="text-xs text-ash-dark">Starting</p>
                    <p className="font-display font-semibold text-fg text-lg sm:text-2xl whitespace-nowrap">{fromPrice}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-card">
                    <p className="text-xs text-ash-dark">Types</p>
                    <p className="font-semibold text-fg text-sm mt-1 leading-tight">{types.join(', ')}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {listings.slice(0, 2).map((p) => (
                    <Link key={p.id} to={`/properties/${p.id}`} className="group flex items-center gap-3 rounded-xl bg-white/70 hover:bg-white p-2 pr-4 transition-colors">
                      <img src={p.images[0]} alt="" className="w-16 h-12 rounded-lg object-cover" loading="lazy" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-fg truncate group-hover:text-gold">{p.title}</span>
                        <span className="block text-xs text-ash">{p.area}</span>
                      </span>
                      <span className="font-display font-semibold text-fg">{p.price}</span>
                    </Link>
                  ))}
                </div>

                <Link to={`/properties?sector=${encodeURIComponent(active)}`} className="neopop-btn mt-6">
                  View all in {active === 'MDC' ? 'MDC' : active} <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <a
                href={whatsappLink(`Hi Varun Estate, I'm looking for a property in ${active}, Panchkula. Please let me know if anything comes up.`)}
                target="_blank"
                rel="noreferrer"
                className="neopop-btn mt-6"
              >
                <MessageCircle size={16} /> Alert me for {active}
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes panelIn { from { opacity: 0; transform: translateX(16px); } }
        @media (min-width: 1024px) {
          .iso-map {
            transform: rotateX(50deg) rotateZ(-30deg) scale(0.84);
            transform-style: preserve-3d;
          }
          .iso-tile { transform-style: preserve-3d; box-shadow: 0 1px 0 rgba(22,23,27,0.08); }
          .iso-lift:hover { transform: translateZ(10px); box-shadow: 0 10px 0 -2px rgba(22,23,27,0.12); }
          .iso-raised { transform: translateZ(22px); box-shadow: 0 22px 0 -4px #8F6B10, 0 30px 30px -10px rgba(22,23,27,0.35); }
          .iso-pin { transform: translateZ(14px); }
        }
      `}</style>
    </section>
  );
}
