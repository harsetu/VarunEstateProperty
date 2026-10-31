import { useEffect, useState, type ReactNode } from 'react';
import { CalendarClock, MapPin, Building2, Ruler, MessageCircle, Check } from 'lucide-react';
import { useHomeViewModel } from '@/features/home/viewmodel/useHomeViewModel';
import type { NewProject, ProjectStatus } from '@/features/properties/model/property';
import { CONTACT, whatsappLink } from '@/core/config/contact';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';
import ImageLightbox from '@/core/widgets/ImageLightbox';
import { usePropertyPhotos } from '@/features/properties/viewmodel/usePropertyPhotos';
import { rich } from '@/core/utils/rich';

import { images } from '@/res';
import ScrollReveal from '@/core/widgets/ScrollReveal';

const STATUS_STYLE: Record<ProjectStatus, string> = {
  'Pre-Launch': 'bg-gold text-white',
  'Under Construction': 'bg-sky-500 text-white',
  'Ready to Move': 'bg-emerald-500 text-white',
};

const enquire = (p: NewProject) =>
  whatsappLink(t('projects.enquire', { company: CONTACT.company, name: p.name, location: p.location }));

const COLS = ['grid-cols-1', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3'];

function Facts({ p }: { p: NewProject }) {
  return (
    <div className={`grid gap-2 text-sm ${COLS[[p.configurations, p.sizeRange, p.possession].filter(Boolean).length] ?? 'grid-cols-1'}`}>
      <div className="rounded-xl bg-white/5 px-3 py-2.5">
        <p className="flex items-center gap-1 text-white/50 text-[0.6875rem] mb-0.5"><Building2 size={12} /> {t('projects.factType')}</p>
        <p className="text-white font-medium leading-tight">{p.configurations}</p>
      </div>
      {p.sizeRange && (
        <div className="rounded-xl bg-white/5 px-3 py-2.5">
          <p className="flex items-center gap-1 text-white/50 text-[0.6875rem] mb-0.5"><Ruler size={12} /> {t('projects.factSize')}</p>
          <p className="text-white font-medium leading-tight">{p.sizeRange}</p>
        </div>
      )}
      {p.possession && (
        <div className="rounded-xl bg-white/5 px-3 py-2.5">
          <p className="flex items-center gap-1 text-white/50 text-[0.6875rem] mb-0.5"><CalendarClock size={12} /> {t('projects.factPossession')}</p>
          <p className="text-white font-medium leading-tight">{p.possession}</p>
        </div>
      )}
    </div>
  );
}

const SLIDE_MS = 4000;

// Crossfading photos with dots; advances on its own and pauses while hovered
function ProjectPhotos({ project: p }: { project: NewProject }) {
  const start = p.images && p.images.length > 0 ? p.images : [p.image || images.placeholder];
  // Label-derived projects carry just a cover photo; their full set is fetched when the card is in view
  const { ref, photos } = usePropertyPhotos<HTMLDivElement>(p.id, start, !!p.images);
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    if (photos.length < 2 || paused || zoom !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setAt((i) => (i + 1) % photos.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [photos.length, paused, zoom]);

  return (
    <div ref={ref} onClick={() => setZoom(at)} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} className="absolute inset-0 cursor-zoom-in">
      {photos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === at ? p.name : ''}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === at ? 'opacity-100 animate-kenburns' : 'opacity-0'}`}
        />
      ))}
      {zoom !== null && <ImageLightbox images={photos} index={zoom} alt={p.name} onChange={setZoom} onClose={() => setZoom(null)} />}
      {photos.length > 1 && (
        <div className="absolute top-4 right-4 flex gap-1.5 rounded-full bg-night/50 backdrop-blur px-2.5 py-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); setAt(i); }}
              className={`h-1.5 rounded-full transition-all ${i === at ? 'w-5 bg-gold-light' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface Heading { eyebrow: string; title: ReactNode; subtitle: string }

export default function NewProjects({ projects: given, heading, bg = 'bg-night' }: { projects?: NewProject[]; heading?: Heading; bg?: string } = {}) {
  const home = useHomeViewModel();
  const projects = given ?? home.projects;
  if (projects.length === 0) return null;

  return (
    <section className={`relative py-20 lg:py-28 px-5 lg:px-8 ${bg} overflow-hidden`}>
      <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-gold/10 blur-[120px] animate-float" />
      <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full bg-gold/5 blur-[100px] animate-float [animation-delay:-4s]" />

      <div className="relative max-w-[1280px] mx-auto">
        <ScrollReveal className="mb-10 lg:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
              </span>
              {heading?.eyebrow ?? t('projects.eyebrow')}
            </p>
            <h2 className="font-display font-semibold text-white text-[clamp(1.875rem,3.5vw,2.75rem)] leading-tight tracking-tight">
              {heading?.title ?? rich('projects.title', { market: flavor.market }, 'text-gold-light')}
            </h2>
            <p className="text-white/65 mt-4 leading-relaxed">
              {heading?.subtitle ?? t('projects.subtitle')}
            </p>
          </div>
          <a href={whatsappLink(t('projects.alertsMsg', { company: CONTACT.company }))} target="_blank" rel="noreferrer" className="neopop-btn neopop-btn-dark shrink-0 w-fit">
            <MessageCircle size={16} /> {t('projects.alerts')}
          </a>
        </ScrollReveal>

        <div className={`grid gap-6 ${projects.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
          {projects.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.12} y={40}>
              <article className="group h-full flex flex-col rounded-[2rem] bg-white/[0.04] border border-white/10 hover:border-gold/40 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-20px_rgb(var(--c-gold)/0.35)] p-3 transition-all duration-500">
                <div className="relative h-[340px] sm:h-[400px] rounded-2xl overflow-hidden">
                  <ProjectPhotos project={p} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow mb-3 animate-pulse ${STATUS_STYLE[p.status]}`}>{t(`projects.status.${p.status}`)}</span>
                      <h3 className="font-display font-semibold text-white text-3xl">{p.name}</h3>
                      <p className="flex items-center gap-1.5 text-white/75 text-sm mt-1"><MapPin size={14} className="text-gold-light" /> {p.location}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-white/60 text-xs">{t('projects.startingFrom')}</p>
                      <p className="font-display font-semibold text-gold-light text-3xl">{p.startingPrice}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-5 p-4 pt-6">
                  <Facts p={p} />
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-1.5 text-white/75 text-sm">
                        <Check size={14} className="text-gold-light" /> {h}
                      </li>
                    ))}
                  </ul>
                  <a href={enquire(p)} target="_blank" rel="noreferrer" className="mt-auto flex items-center justify-center gap-2 rounded-full bg-gold text-white font-semibold py-3.5 hover:bg-gold-dark transition-colors">
                    <MessageCircle size={16} /> {t('projects.brochureLong')}
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
