import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PROPERTIES, NEARBY_BY_SECTOR, type NearbyCategory } from '@/data/properties';
import {
  Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight, X, Share2, Check, CalendarCheck, Phone,
  PlayCircle, Video, LayoutGrid, GraduationCap, Hospital, ShoppingBag, TrainFront, Trees, MessageCircle,
} from 'lucide-react';
import SiteVisitModal from '@/components/SiteVisitModal';
import { CONTACT, whatsappLink } from '@/data/contact';

const NEARBY_ICON: Record<NearbyCategory, typeof GraduationCap> = {
  school: GraduationCap,
  hospital: Hospital,
  market: ShoppingBag,
  transport: TrainFront,
  park: Trees,
};
import ScrollReveal from '@/components/ScrollReveal';
import PropertyCard from '@/components/PropertyCard';

export default function PropertyDetail() {
  const { id } = useParams();
  const property = PROPERTIES.find((p) => p.id === id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Leave room under the footer for the mobile action bar
  useEffect(() => {
    document.body.classList.add('has-action-bar');
    return () => document.body.classList.remove('has-action-bar');
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-ash text-lg mb-4">Property not found.</p>
          <Link to="/properties" className="text-gold hover:underline">Back to Properties</Link>
        </div>
      </div>
    );
  }

  // Same type first, then same sector, so there are usually three suggestions
  const related = PROPERTIES.filter((p) => p.id !== property.id)
    .map((p) => ({ p, score: (p.type === property.type ? 2 : 0) + (p.sector === property.sector ? 1 : 0) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ p }) => p);

  const nearby = property.nearby ?? NEARBY_BY_SECTOR[property.sector] ?? [];
  const ask = (what: string) => whatsappLink(`Hi Varun Estate, please share the ${what} for ${property.title} (${property.sector}).`);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const handleShare = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((i) => i !== null ? (i + 1) % property.images.length : null);
  const prevImage = () => setLightboxIndex((i) => i !== null ? (i - 1 + property.images.length) % property.images.length : null);

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        <Link to="/properties" className="text-ash hover:text-gold text-sm flex items-center gap-1 mb-6 transition-colors" data-cursor="hover">
          <ChevronLeft size={16} /> Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-gold text-white text-xs font-bold uppercase tracking-wider">{property.type}</span>
                <span className="px-3 py-1 bg-ink-700 text-fg text-xs font-medium border border-fg/10">{property.purpose}</span>
                <span className="text-ash text-sm flex items-center gap-1"><MapPin size={14} /> {property.sector}</span>
              </div>
              <h1 className="font-display font-semibold text-fg text-[clamp(1.75rem,4vw,3.25rem)] tracking-tight mb-6">
                {property.title}
              </h1>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i)}
                  className={`relative overflow-hidden rounded-xl bg-ink-700 group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                  data-cursor="view"
                >
                  <img
                    src={img}
                    alt={`${property.title} ${i + 1}`}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors" />
                </button>
              ))}
            </div>

            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">Overview</h2>
              <p className="text-ash leading-relaxed mb-12">{property.description}</p>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                  <Maximize size={20} className="text-gold mb-2" />
                  <p className="text-ash-dark text-xs uppercase tracking-wider">Area</p>
                  <p className="text-fg font-semibold">{property.area}</p>
                </div>
                {property.bedrooms && (
                  <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                    <Bed size={20} className="text-gold mb-2" />
                    <p className="text-ash-dark text-xs uppercase tracking-wider">Bedrooms</p>
                    <p className="text-fg font-semibold">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                    <Bath size={20} className="text-gold mb-2" />
                    <p className="text-ash-dark text-xs uppercase tracking-wider">Bathrooms</p>
                    <p className="text-fg font-semibold">{property.bathrooms}</p>
                  </div>
                )}
                <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                  <MapPin size={20} className="text-gold mb-2" />
                  <p className="text-ash-dark text-xs uppercase tracking-wider">Sector</p>
                  <p className="text-fg font-semibold">{property.sector}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-ash">
                    <Check size={16} className="text-gold shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* Video tour */}
            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">Video tour</h2>
              {property.videoUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-night mb-12 shadow-card">
                  <iframe
                    src={property.videoUrl}
                    title={`${property.title} video tour`}
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden mb-12 shadow-card">
                  <img src={property.images[1] ?? property.images[0]} alt="" className="w-full aspect-[16/7] object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-night/65 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-6 text-center sm:text-left">
                    <PlayCircle size={56} className="text-white/90 shrink-0" strokeWidth={1.25} />
                    <div>
                      <p className="font-display font-semibold text-white text-xl">Can't visit right now?</p>
                      <p className="text-white/75 text-sm mt-1 mb-4">Get a recorded walkthrough or a live video call tour on WhatsApp.</p>
                      <a href={ask('video tour')} target="_blank" rel="noreferrer" className="neopop-btn neopop-btn-dark">
                        <Video size={16} /> Request video tour
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </ScrollReveal>

            {/* Floor plans */}
            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">Floor plans</h2>
              {property.floorPlans && property.floorPlans.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4 mb-12">
                  {property.floorPlans.map((plan, i) => (
                    <a key={plan} href={plan} target="_blank" rel="noreferrer" className="group block rounded-2xl bg-white border border-fg/10 p-3 shadow-card hover:shadow-card-hover transition-shadow">
                      <img src={plan} alt={`Floor plan ${i + 1}`} className="w-full aspect-[4/3] object-contain" loading="lazy" />
                      <p className="text-sm text-ash mt-2 text-center group-hover:text-gold">Floor plan {i + 1} · tap to enlarge</p>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-dashed border-fg/20 bg-white/60 p-6 mb-12">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <LayoutGrid size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-fg">Detailed floor plan available on request</p>
                    <p className="text-ash text-sm">Room sizes, layout and site plan — sent to your WhatsApp.</p>
                  </div>
                  <a href={ask('floor plan')} target="_blank" rel="noreferrer" className="neopop-btn neopop-btn-outline shrink-0">
                    Get floor plan
                  </a>
                </div>
              )}
            </ScrollReveal>

            {/* Nearby */}
            {nearby.length > 0 && (
              <ScrollReveal>
                <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">What's nearby</h2>
                <div className="grid sm:grid-cols-2 gap-3 mb-12">
                  {nearby.map((place) => {
                    const Icon = NEARBY_ICON[place.category];
                    return (
                      <div key={place.name} className="flex items-center gap-3 rounded-xl bg-white border border-fg/10 px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-fg text-sm font-medium truncate">{place.name}</p>
                          <p className="text-ash-dark text-xs capitalize">{place.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-fg shrink-0">{place.distance}</span>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">Location</h2>
              <div className="relative h-80 rounded-2xl bg-ink-700 border border-fg/10 overflow-hidden">
                <iframe
                  src={property.mapEmbed}
                  className="w-full h-full"
                  loading="lazy"
                  title="Property location"
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl shadow-card p-8">
                <p className="text-ash-dark text-xs uppercase tracking-wider mb-2">Price</p>
                <p className="font-display font-semibold text-gold text-4xl mb-6">{property.price}</p>

                <div className="space-y-3 mb-6 pb-6 border-b border-fg/8">
                  <div className="flex justify-between text-sm">
                    <span className="text-ash">Type</span>
                    <span className="text-fg font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ash">Purpose</span>
                    <span className="text-fg font-medium">{property.purpose}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ash">Area</span>
                    <span className="text-fg font-medium">{property.area}</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex justify-between text-sm">
                      <span className="text-ash">Bedrooms</span>
                      <span className="text-fg font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button onClick={() => setVisitOpen(true)} className="neopop-btn w-full !bg-gold !border-gold hover:!bg-gold-dark">
                    <CalendarCheck size={17} /> Schedule site visit
                  </button>
                  <p className="text-center text-xs text-ash-dark -mt-1">Free · Pick your date & time</p>
                  <a href={whatsappLink(`Hi, I'm interested in ${property.title} (${property.sector}).`)} target="_blank" rel="noreferrer" className="neopop-btn w-full !bg-[#25D366] !border-[#25D366]">
                    <MessageCircle size={17} /> Enquire on WhatsApp
                  </a>
                  <a href={CONTACT.phoneHref} className="neopop-btn w-full">
                    <Phone size={17} /> Call now
                  </a>
                  <button
                    onClick={handleShare}
                    className="neopop-btn neopop-btn-outline w-full"
                    data-cursor="hover"
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl shadow-card p-6">
                <p className="text-fg font-semibold mb-1">Varun Estate</p>
                <p className="text-ash text-sm mb-3">Your trusted real estate partner in Panchkula.</p>
                <a href={CONTACT.phoneHref} className="text-gold text-sm font-medium">{CONTACT.phoneDisplay}</a>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display font-bold text-fg text-3xl tracking-tight mb-8">
              Similar <span className="gold-gradient-text">Properties</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SiteVisitModal open={visitOpen} onClose={() => setVisitOpen(false)} property={property} />

      {/* Mobile action bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[5500] bg-white/95 backdrop-blur border-t border-fg/10 px-4 py-3 flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-[0.6875rem] text-ash-dark leading-none">Price</p>
          <p className="font-display font-semibold text-fg text-lg leading-tight truncate">{property.price}</p>
        </div>
        <a href={CONTACT.phoneHref} aria-label="Call" className="ml-auto w-11 h-11 rounded-full border border-fg/15 flex items-center justify-center text-fg shrink-0">
          <Phone size={18} />
        </a>
        <button onClick={() => setVisitOpen(true)} className="neopop-btn !bg-gold !border-gold !px-5 !py-2.5 shrink-0">
          <CalendarCheck size={16} /> Book visit
        </button>
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[8000] bg-night/95 flex items-center justify-center" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 text-white hover:text-gold" onClick={closeLightbox}>
            <X size={32} />
          </button>
          <button className="absolute left-6 text-white hover:text-gold" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ChevronLeft size={40} />
          </button>
          <img
            src={property.images[lightboxIndex]}
            alt="Gallery"
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute right-6 text-white hover:text-gold" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight size={40} />
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {property.images.length}
          </p>
        </div>
      )}
    </div>
  );
}
