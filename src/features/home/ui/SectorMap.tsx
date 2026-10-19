import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { useHomeViewModel } from '@/features/home/viewmodel/useHomeViewModel';
import { startingPrice } from '@/features/properties/model/propertyRules';
import { CONTACT, whatsappLink } from '@/core/config/contact';
import flavor from '@/flavors';
import SectionHeading from '@/core/widgets/SectionHeading';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';
import { images } from '@/res';

// Tiles come from the distinct property locations, so the map always matches the listings
const COLUMNS = 4;

export default function SectorMap() {
  const { bySector, sectors, content } = useHomeViewModel();

  const firstActive = sectors[0] ?? '';
  const [picked, setActive] = useState<string | null>(null);
  const active = picked ?? firstActive;

  const listings = bySector.get(active) ?? [];
  const info = content.sectorInfo[active];
  const fromPrice = startingPrice(listings);
  const types = [...new Set(listings.map((p) => p.type))];

  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8 bg-ink-800 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading
          eyebrow={t('sectors.eyebrow')}
          title={rich('sectors.title')}
          subtitle={t('sectors.subtitle')}
        />

        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Map */}
          <ScrollReveal>
            <div className="relative lg:py-4 lg:px-6 [perspective:1600px]">
              <div
                style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
                className="iso-map grid gap-2 sm:gap-3 p-3 sm:p-4 rounded-[1.75rem] bg-[#E9E3D6] shadow-card-3d">
                {sectors.map((name) => {
                  const count = bySector.get(name)?.length ?? 0;
                  const isActive = active === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setActive(name)}
                      aria-pressed={isActive}
                      aria-label={t('sectors.tileAria', { name, count })}
                      className={`iso-tile relative aspect-square min-h-0 rounded-xl text-left transition-all duration-300 ${
                        isActive
                          ? 'bg-gold text-white iso-raised'
                          : count
                            ? 'bg-white text-fg hover:bg-gold/15 iso-lift'
                            : 'bg-white/45 text-ash-dark hover:bg-white/70'
                      }`}
                    >
                      <span className="absolute left-2 top-1.5 right-6 sm:left-3 sm:top-2 font-display font-semibold text-xs sm:text-base leading-tight break-words line-clamp-3">
                        {name}
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
                {t('sectors.mapNote')}
              </p>
            </div>
          </ScrollReveal>

          {/* Detail panel */}
          <div key={active} className="animate-[panelIn_0.45s_cubic-bezier(0.22,1,0.36,1)]">
            <p className="flex items-center gap-1.5 text-gold text-sm font-semibold uppercase tracking-[0.18em]">
              <MapPin size={15} /> {flavor.market}
            </p>
            <h3 className="font-display font-semibold text-fg text-4xl mt-2">
              {active}
            </h3>
            <p className="text-ash leading-relaxed mt-3">
              {info?.vibe ?? (listings.length ? t('sectors.genericVibe', { name: active, market: flavor.market }) : t('sectors.noListing'))}
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
                    <p className="text-xs text-ash-dark">{t('sectors.listings')}</p>
                    <p className="font-display font-semibold text-fg text-xl sm:text-2xl">{listings.length}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-card">
                    <p className="text-xs text-ash-dark">{t('sectors.starting')}</p>
                    <p className="font-display font-semibold text-fg text-lg sm:text-2xl whitespace-nowrap">{fromPrice}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 sm:p-4 shadow-card">
                    <p className="text-xs text-ash-dark">{t('sectors.types')}</p>
                    <p className="font-semibold text-fg text-sm mt-1 leading-tight">{types.join(', ')}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {listings.slice(0, 2).map((p) => (
                    <Link key={p.id} to={`/properties/${p.id}`} className="group flex items-center gap-3 rounded-xl bg-white/70 hover:bg-white p-2 pr-4 transition-colors">
                      <img src={p.images[0] ?? images.placeholder} alt="" className="w-16 h-12 rounded-lg object-cover" loading="lazy" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-fg truncate group-hover:text-gold">{p.title}</span>
                        <span className="block text-xs text-ash">{p.area}</span>
                      </span>
                      <span className="font-display font-semibold text-fg">{p.price}</span>
                    </Link>
                  ))}
                </div>

                <Link to={`/properties?sector=${encodeURIComponent(active)}`} className="neopop-btn mt-6">
                  {t('sectors.viewAll', { name: active })} <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <a
                href={whatsappLink(t('sectors.alertMsg', { company: CONTACT.company, name: active, market: flavor.market }))}
                target="_blank"
                rel="noreferrer"
                className="neopop-btn mt-6"
              >
                <MessageCircle size={16} /> {t('sectors.alertMe', { name: active })}
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
