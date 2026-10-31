import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react';
import type { Property } from '@/features/properties/model/property';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import TiltCard from '@/core/widgets/TiltCard';
import { t } from '@/core/utils/i18n';
import { isPriceRange } from '@/core/utils/pricing';
import flavor from '@/flavors';
import { images } from '@/res';
import ImageLightbox from '@/core/widgets/ImageLightbox';
import { usePropertyPhotos } from '@/features/properties/viewmodel/usePropertyPhotos';

const SLIDE_MS = 3500;

export default function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  // Moving across the photo flips through the gallery, no clicks needed
  const [photo, setPhoto] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const { ref, photos: all } = usePropertyPhotos<HTMLDivElement>(property.id, property.images);
  const photos = all.length ? all.slice(0, 6) : [images.placeholder];

  // Flip through the gallery on its own, unless the pointer is on the photo
  useEffect(() => {
    if (photos.length < 2 || hovering || zoom !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setPhoto((i) => (i + 1) % photos.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [photos.length, hovering, zoom]);
  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || photos.length < 2) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPhoto(Math.min(photos.length - 1, Math.floor(((e.clientX - r.left) / r.width) * photos.length)));
  };

  return (
    <ScrollReveal delay={Math.min(index, 5) * 0.06} className="h-full">
      <TiltCard className="rounded-2xl bg-white shadow-card hover:shadow-card-3d">
        <Link
          to={`/properties/${property.id}`}
          className="group flex flex-col h-full rounded-2xl [transform-style:preserve-3d]"
        >
          <div className="relative p-2 pb-0 [transform:translateZ(30px)]">
            <div
              ref={ref}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setZoom(photo); }}
              onPointerMove={scrub}
              onPointerEnter={() => setHovering(true)}
              onPointerLeave={() => setHovering(false)}
              className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-zoom-in shadow-[0_12px_24px_-10px_rgba(22,23,27,0.35)]"
            >
              {photos.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={i === 0 ? property.title : ''}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    i === photo ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              {photos.length > 1 && (
                <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5">
                  {photos.map((src, i) => (
                    <span key={src} className={`h-1 rounded-full transition-all ${i === photo ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`} />
                  ))}
                </div>
              )}
            </div>
            <div className="absolute top-5 left-5 flex gap-2 [transform:translateZ(20px)]">
              <span className="px-3 py-1 rounded-full bg-white/95 text-fg text-xs font-semibold shadow">{property.type}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${
                  property.purpose === 'Rent' ? 'bg-emerald-600' : 'bg-gold'
                }`}
              >
                {t('card.for', { purpose: property.purpose })}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 p-5 [transform:translateZ(20px)]">
            <p className="flex items-center gap-1.5 text-ash text-sm mb-1.5">
              <MapPin size={14} className="text-gold" /> {t('card.location', { sector: property.sector, market: flavor.market })}
            </p>
            <h3 className="font-display font-semibold text-fg text-xl leading-snug mb-4 group-hover:text-gold transition-colors">
              {property.title}
            </h3>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-ash text-sm pb-4 mb-4 border-b border-fg/10">
              <span className="flex items-center gap-1.5"><Maximize size={15} /> {property.area}</span>
              {property.bedrooms && <span className="flex items-center gap-1.5"><Bed size={15} /> {t('card.beds', { count: property.bedrooms })}</span>}
              {property.bathrooms && <span className="flex items-center gap-1.5"><Bath size={15} /> {t('card.baths', { count: property.bathrooms })}</span>}
            </div>

            <div className="mt-auto flex items-center justify-between [transform:translateZ(15px)]">
              <span className="min-w-0">
                {isPriceRange(property.priceValue, property.priceMax) && <span className="block mb-1"><span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[0.6875rem] font-semibold uppercase tracking-wide">{t('price.approx')}</span></span>}
                <span className={`block font-display font-semibold text-fg ${isPriceRange(property.priceValue, property.priceMax) ? 'text-lg' : 'text-2xl'}`}>{property.price}</span>
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-gold">
                {t('card.viewDetails')} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </TiltCard>
      {zoom !== null && <ImageLightbox images={all.length ? all : photos} index={zoom} alt={property.title} onChange={setZoom} onClose={() => setZoom(null)} />}
    </ScrollReveal>
  );
}
