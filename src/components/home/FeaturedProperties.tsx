import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Bed, Bath, Maximize, MapPin, CalendarCheck } from 'lucide-react';
import { PROPERTIES } from '@/data/properties';
import PropertyCard from '@/components/PropertyCard';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';
import SiteVisitModal from '@/components/SiteVisitModal';

const ROTATE_MS = 6000;

export default function FeaturedProperties() {
  // Featured first, topped up with other listings
  const list = [...PROPERTIES].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 6);

  const [active, setActive] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);

  const property = list[active];

  const select = (i: number) => {
    setActive(i);
    setPhoto(0);
  };

  // Gently rotate the spotlight unless the visitor is interacting with it
  useEffect(() => {
    if (paused || visitOpen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => select((active + 1) % list.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, paused, visitOpen, list.length]);

  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8 bg-ink-800">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading
          eyebrow="Featured listings"
          title={<>Handpicked homes, <em className="text-gold">ready to visit</em></>}
          subtitle="Every listing is personally inspected and legally verified by our team before it reaches you."
          action={
            <Link to="/properties" className="neopop-btn-outline neopop-btn shrink-0">
              View all properties <ArrowRight size={16} />
            </Link>
          }
        />

        {/* Desktop: spotlight showroom */}
        <ScrollReveal className="hidden lg:block">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="grid grid-cols-[1.45fr_1fr] gap-8 items-stretch"
          >
            {/* Spotlight */}
            <div key={property.id} className="relative rounded-[2rem] bg-white shadow-card-3d p-3 animate-[spotIn_0.6s_cubic-bezier(0.22,1,0.36,1)]">
              <div className="relative h-[430px] rounded-t-[260px] rounded-b-[1.5rem] overflow-hidden">
                {property.images.slice(0, 5).map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={i === 0 ? property.title : ''}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                      i === photo ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-white/95 text-fg text-xs font-semibold shadow">{property.type}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${property.purpose === 'Rent' ? 'bg-emerald-600' : 'bg-gold'}`}>
                        For {property.purpose}
                      </span>
                    </div>
                    <p className="flex items-center gap-1.5 text-white/80 text-sm"><MapPin size={14} /> {property.sector}, Panchkula</p>
                    <h3 className="font-display font-semibold text-white text-3xl mt-1">{property.title}</h3>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-white/95 backdrop-blur px-5 py-3 text-right shadow-card-hover">
                    <p className="text-[0.6875rem] uppercase tracking-wider text-ash-dark">Price</p>
                    <p className="font-display font-semibold text-fg text-2xl leading-tight">{property.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 px-3 pt-5 pb-3">
                <div className="flex gap-2">
                  {property.images.slice(0, 5).map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setPhoto(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`w-14 h-11 rounded-lg overflow-hidden ring-2 transition-all ${
                        i === photo ? 'ring-gold' : 'ring-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-5 text-ash text-sm">
                  <span className="flex items-center gap-1.5"><Maximize size={16} className="text-gold" /> {property.area}</span>
                  {property.bedrooms && <span className="flex items-center gap-1.5"><Bed size={16} className="text-gold" /> {property.bedrooms}</span>}
                  {property.bathrooms && <span className="flex items-center gap-1.5"><Bath size={16} className="text-gold" /> {property.bathrooms}</span>}
                </div>
              </div>

              <div className="flex gap-3 px-3 pb-2">
                <button onClick={() => setVisitOpen(true)} className="neopop-btn flex-1 !bg-gold !border-gold hover:!bg-gold-dark">
                  <CalendarCheck size={17} /> Book site visit
                </button>
                <Link to={`/properties/${property.id}`} className="neopop-btn neopop-btn-outline flex-1">
                  View details <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            {/* Listing rail */}
            <div className="flex flex-col gap-2.5">
              {list.map((p, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={p.id}
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                    className={`relative flex items-center gap-4 rounded-2xl p-2.5 pr-5 text-left overflow-hidden transition-all duration-300 ${
                      isActive ? 'bg-white shadow-card-hover translate-x-[-6px]' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  >
                    <span className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gold transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    <img src={p.images[0]} alt="" loading="lazy" className="w-20 h-16 rounded-xl object-cover shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs text-ash-dark">{p.type} · {p.sector}</span>
                      <span className={`block font-display font-semibold text-[1.05rem] truncate ${isActive ? 'text-fg' : 'text-fg/80'}`}>{p.title}</span>
                      <span className="block text-xs text-ash">{p.area}</span>
                    </span>
                    <span className={`font-display font-semibold shrink-0 ${isActive ? 'text-gold text-lg' : 'text-fg/70'}`}>{p.price}</span>

                    {isActive && !paused && !visitOpen && (
                      <span className="absolute left-0 bottom-0 h-0.5 bg-gold/70 animate-[spotProgress_linear_forwards]" style={{ animationDuration: `${ROTATE_MS}ms` }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile / tablet: card grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {list.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      </div>

      <SiteVisitModal open={visitOpen} onClose={() => setVisitOpen(false)} property={property} />

      <style>{`
        @keyframes spotIn { from { opacity: 0.4; transform: translateY(10px) scale(0.99); } }
        @keyframes spotProgress { from { width: 0; } to { width: 100%; } }
      `}</style>
    </section>
  );
}
