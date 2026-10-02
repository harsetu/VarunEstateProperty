import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react';
import type { Property } from '@/data/properties';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';

export default function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  // Moving across the photo flips through the gallery, no clicks needed
  const [photo, setPhoto] = useState(0);
  const photos = property.images.slice(0, 5);
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
              onPointerMove={scrub}
              onPointerLeave={() => setPhoto(0)}
              className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_12px_24px_-10px_rgba(22,23,27,0.35)]"
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
                <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                For {property.purpose}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 p-5 [transform:translateZ(20px)]">
            <p className="flex items-center gap-1.5 text-ash text-sm mb-1.5">
              <MapPin size={14} className="text-gold" /> {property.sector}, Panchkula
            </p>
            <h3 className="font-display font-semibold text-fg text-xl leading-snug mb-4 group-hover:text-gold transition-colors">
              {property.title}
            </h3>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-ash text-sm pb-4 mb-4 border-b border-fg/10">
              <span className="flex items-center gap-1.5"><Maximize size={15} /> {property.area}</span>
              {property.bedrooms && <span className="flex items-center gap-1.5"><Bed size={15} /> {property.bedrooms} Beds</span>}
              {property.bathrooms && <span className="flex items-center gap-1.5"><Bath size={15} /> {property.bathrooms} Baths</span>}
            </div>

            <div className="mt-auto flex items-center justify-between [transform:translateZ(15px)]">
              <span className="font-display font-semibold text-fg text-2xl">{property.price}</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-gold">
                View details <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </TiltCard>
    </ScrollReveal>
  );
}
