import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePropertyDetailViewModel } from '@/features/properties/viewmodel/usePropertyDetailViewModel';
import type { NearbyCategory } from '@/features/properties/model/property';
import {
  Bed, Bath, Maximize, MapPin, Share2, Check, CalendarCheck, Phone,
  PlayCircle, Video, LayoutGrid, GraduationCap, Hospital, ShoppingBag, TrainFront, Trees, MessageCircle,
} from 'lucide-react';
import SiteVisitModal from '@/features/properties/ui/SiteVisitModal';
import { CONTACT, whatsappLink } from '@/core/config/contact';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';

const NEARBY_ICON: Record<NearbyCategory, typeof GraduationCap> = {
  school: GraduationCap,
  hospital: Hospital,
  market: ShoppingBag,
  transport: TrainFront,
  park: Trees,
};
import ScrollReveal from '@/core/widgets/ScrollReveal';
import PropertyFacts from '@/features/properties/ui/PropertyFacts';
import PropertyCard from '@/features/properties/ui/PropertyCard';
import { images } from '@/res';
import { isPriceRange } from '@/core/utils/pricing';
import ImageLightbox from '@/core/widgets/ImageLightbox';

export default function PropertyDetail() {
  const { id } = useParams();
  const { status, property, nearby, related } = usePropertyDetailViewModel(id);
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

  if (status === 'loading') {
    return <div className="min-h-screen bg-ink-900 flex items-center justify-center pt-28 text-ash">{t('detail.loading')}</div>;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-ash text-lg mb-4">{t('detail.notFound')}</p>
          <Link to="/properties" className="text-gold hover:underline">{t('detail.backLink')}</Link>
        </div>
      </div>
    );
  }

  const ask = (what: string) => whatsappLink(t('detail.askMsg', { company: CONTACT.company, what, title: property.title, sector: property.sector }));

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const handleShare = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        <Link to="/properties" className="text-ash hover:text-gold text-sm flex items-center gap-1 mb-6 transition-colors" data-cursor="hover">
          <ChevronLeft size={16} /> {t('detail.back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-gold text-white text-xs font-bold uppercase tracking-wider">{property.type}</span>
                <span className="px-3 py-1 bg-ink-700 text-fg text-xs font-medium border border-fg/10">{property.purpose}</span>
                <span className="text-ash text-sm flex items-center gap-1"><MapPin size={14} /> {property.sector}</span>
                {(property.labels ?? []).map((l) => (
                  <span key={l} className="px-3 py-1 rounded-full bg-gold/10 text-fg text-xs font-semibold">{t(`label.${l}`)}</span>
                ))}
              </div>
              <h1 className="font-display font-semibold text-fg text-[clamp(1.75rem,4vw,3.25rem)] tracking-tight mb-6">
                {property.title}
              </h1>
              {property.info && <p className="text-ash text-lg -mt-3 mb-6">{property.info}</p>}
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
                    alt={t('detail.photoAlt', { title: property.title, n: i + 1 })}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors" />
                </button>
              ))}
            </div>

            {property.description && (
              <ScrollReveal>
                <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.overview')}</h2>
                <p className="text-ash leading-relaxed mb-12 whitespace-pre-line">{property.description}</p>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.specs')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                {property.area && (
                <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                  <Maximize size={20} className="text-gold mb-2" />
                  <p className="text-ash-dark text-xs uppercase tracking-wider">{t('detail.area')}</p>
                  <p className="text-fg font-semibold">{property.area}</p>
                </div>
                )}
                {property.bedrooms != null && (
                  <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                    <Bed size={20} className="text-gold mb-2" />
                    <p className="text-ash-dark text-xs uppercase tracking-wider">{t('detail.bedrooms')}</p>
                    <p className="text-fg font-semibold">{property.bedrooms}</p>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                    <Bath size={20} className="text-gold mb-2" />
                    <p className="text-ash-dark text-xs uppercase tracking-wider">{t('detail.bathrooms')}</p>
                    <p className="text-fg font-semibold">{property.bathrooms}</p>
                  </div>
                )}
                <div className="bg-ink-700 border border-fg/8 rounded-xl p-5">
                  <MapPin size={20} className="text-gold mb-2" />
                  <p className="text-ash-dark text-xs uppercase tracking-wider">{t('detail.sector')}</p>
                  <p className="text-fg font-semibold">{property.sector}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <PropertyFacts property={property} />
            </ScrollReveal>

            {property.amenities.length > 0 && (
            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.amenities')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-ash">
                    <Check size={16} className="text-gold shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            )}

            {/* Video tour */}
            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.videoTour')}</h2>
              {property.videoUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-night mb-12 shadow-card">
                  <iframe
                    src={property.videoUrl}
                    title={t('detail.videoTitle', { title: property.title })}
                    className="absolute inset-0 w-full h-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden mb-12 shadow-card">
                  <img src={property.images[1] ?? property.images[0] ?? images.placeholder} alt="" className="w-full aspect-[16/7] object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-night/65 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-6 text-center sm:text-left">
                    <PlayCircle size={56} className="text-white/90 shrink-0" strokeWidth={1.25} />
                    <div>
                      <p className="font-display font-semibold text-white text-xl">{t('detail.cantVisit')}</p>
                      <p className="text-white/75 text-sm mt-1 mb-4">{t('detail.cantVisitBody')}</p>
                      <a href={ask(t('detail.whatVideo'))} target="_blank" rel="noreferrer" className="neopop-btn neopop-btn-dark">
                        <Video size={16} /> {t('detail.requestVideo')}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </ScrollReveal>

            {/* Floor plans */}
            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.floorPlans')}</h2>
              {property.floorPlans && property.floorPlans.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4 mb-12">
                  {property.floorPlans.map((plan, i) => (
                    <a key={plan} href={plan} target="_blank" rel="noreferrer" className="group block rounded-2xl bg-white border border-fg/10 p-3 shadow-card hover:shadow-card-hover transition-shadow">
                      <img src={plan} alt={t('detail.floorAlt', { n: i + 1 })} className="w-full aspect-[4/3] object-contain" loading="lazy" />
                      <p className="text-sm text-ash mt-2 text-center group-hover:text-gold">{t('detail.floorEnlarge', { n: i + 1 })}</p>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-dashed border-fg/20 bg-white/60 p-6 mb-12">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <LayoutGrid size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-fg">{t('detail.floorOnRequest')}</p>
                    <p className="text-ash text-sm">{t('detail.floorOnRequestBody')}</p>
                  </div>
                  <a href={ask(t('detail.whatFloor'))} target="_blank" rel="noreferrer" className="neopop-btn neopop-btn-outline shrink-0">
                    {t('detail.getFloor')}
                  </a>
                </div>
              )}
            </ScrollReveal>

            {/* Nearby */}
            {nearby.length > 0 && (
              <ScrollReveal>
                <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.nearby')}</h2>
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
                          <p className="text-ash-dark text-xs capitalize">{t(`detail.nearby.${place.category}`)}</p>
                        </div>
                        <span className="text-sm font-semibold text-fg shrink-0">{place.distance}</span>
                      </div>
                    );
                  })}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.location')}</h2>
              <div className="relative h-80 rounded-2xl bg-ink-700 border border-fg/10 overflow-hidden">
                <iframe
                  src={property.mapEmbed}
                  className="w-full h-full"
                  loading="lazy"
                  title={t('detail.locationTitle')}
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl shadow-card p-8">
                <p className="text-ash-dark text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  {t('detail.price')}
                  {isPriceRange(property.priceValue, property.priceMax) && <span className="px-2 py-0.5 normal-case rounded-full bg-gold/10 text-gold text-[0.6875rem] font-semibold uppercase tracking-wide">{t('price.approx')}</span>}
                </p>
                <p className={`font-display font-semibold text-gold ${isPriceRange(property.priceValue, property.priceMax) ? 'text-3xl' : 'text-4xl'} ${property.priceNegotiable ? 'mb-1' : 'mb-6'}`}>{property.price}</p>
                {property.priceNegotiable && <p className="text-ash text-sm mb-6">{t('detail.negotiable')}</p>}

                <div className="space-y-3 mb-6 pb-6 border-b border-fg/8">
                  <div className="flex justify-between text-sm">
                    <span className="text-ash">{t('detail.type')}</span>
                    <span className="text-fg font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ash">{t('detail.purpose')}</span>
                    <span className="text-fg font-medium">{t(`purpose.${property.purpose}`)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ash">{t('detail.area')}</span>
                    <span className="text-fg font-medium">{property.area}</span>
                  </div>
                  {property.bedrooms != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-ash">{t('detail.bedrooms')}</span>
                      <span className="text-fg font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <button onClick={() => setVisitOpen(true)} className="neopop-btn w-full !bg-gold !border-gold hover:!bg-gold-dark">
                    <CalendarCheck size={17} /> {t('detail.scheduleVisit')}
                  </button>
                  <p className="text-center text-xs text-ash-dark -mt-1">{t('detail.scheduleNote')}</p>
                  <a href={whatsappLink(t('detail.interested', { title: property.title, sector: property.sector }))} target="_blank" rel="noreferrer" className="neopop-btn w-full !bg-[#25D366] !border-[#25D366]">
                    <MessageCircle size={17} /> {t('detail.enquire')}
                  </a>
                  <a href={CONTACT.phoneHref} className="neopop-btn w-full">
                    <Phone size={17} /> {t('detail.callNow')}
                  </a>
                  <button
                    onClick={handleShare}
                    className="neopop-btn neopop-btn-outline w-full"
                    data-cursor="hover"
                  >
                    {copied ? <Check size={16} /> : <Share2 size={16} />}
                    {copied ? t('detail.copied') : t('detail.share')}
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl shadow-card p-6">
                <p className="text-fg font-semibold mb-1">{CONTACT.company}</p>
                <p className="text-ash text-sm mb-3">{t('detail.partner', { market: flavor.market })}</p>
                <a href={CONTACT.phoneHref} className="text-gold text-sm font-medium">{CONTACT.phoneDisplay}</a>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display font-bold text-fg text-3xl tracking-tight mb-8">
              {t('detail.similar')} <span className="gold-gradient-text">{t('detail.similarEm')}</span>
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
          <p className="text-[0.6875rem] text-ash-dark leading-none">{t('detail.price')}</p>
          <p className="font-display font-semibold text-fg text-lg leading-tight truncate">{property.price}</p>
        </div>
        <a href={CONTACT.phoneHref} aria-label={t('detail.call')} className="ml-auto w-11 h-11 rounded-full border border-fg/15 flex items-center justify-center text-fg shrink-0">
          <Phone size={18} />
        </a>
        <button onClick={() => setVisitOpen(true)} className="neopop-btn !bg-gold !border-gold !px-5 !py-2.5 shrink-0">
          <CalendarCheck size={16} /> {t('detail.bookVisit')}
        </button>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox images={property.images} index={lightboxIndex} alt={t('detail.gallery')} onChange={setLightboxIndex} onClose={closeLightbox} />
      )}
    </div>
  );
}
