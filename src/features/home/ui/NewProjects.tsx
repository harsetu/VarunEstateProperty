import { CalendarClock, MapPin, Building2, Ruler, MessageCircle, Check } from 'lucide-react';
import { useHomeViewModel } from '@/features/home/viewmodel/useHomeViewModel';
import type { NewProject, ProjectStatus } from '@/features/properties/model/property';
import { CONTACT, whatsappLink } from '@/core/config/contact';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';

import { images } from '@/res';
import ScrollReveal from '@/core/widgets/ScrollReveal';

const STAGES = [t('projects.stageLaunch'), t('projects.stageConstruction'), t('projects.stagePossession')];
const STAGE_OF: Record<ProjectStatus, number> = {
  'Pre-Launch': 0,
  'Under Construction': 1,
  'Ready to Move': 2,
};
const STATUS_STYLE: Record<ProjectStatus, string> = {
  'Pre-Launch': 'bg-gold text-white',
  'Under Construction': 'bg-sky-500 text-white',
  'Ready to Move': 'bg-emerald-500 text-white',
};

const enquire = (p: NewProject) =>
  whatsappLink(t('projects.enquire', { company: CONTACT.company, name: p.name, location: p.location }));

// Launch → Construction → Possession, with the current stage pulsing
function Stepper({ status }: { status: ProjectStatus }) {
  const at = STAGE_OF[status];
  return (
    <div className="relative">
      <div className="absolute left-[8%] right-[8%] top-[7px] h-0.5 bg-white/15" />
      <div
        className="absolute left-[8%] top-[7px] h-0.5 bg-gold-light transition-all"
        style={{ width: `${(at / (STAGES.length - 1)) * 84}%` }}
      />
      <div className="relative grid grid-cols-3">
        {STAGES.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1.5">
            <span className="relative flex h-4 w-4">
              {i === at && <span className="absolute inset-0 rounded-full bg-gold-light/60 animate-ping" />}
              <span className={`relative h-4 w-4 rounded-full border-2 ${i <= at ? 'bg-gold-light border-gold-light' : 'bg-night border-white/30'}`} />
            </span>
            <span className={`text-[0.6875rem] ${i <= at ? 'text-white' : 'text-white/40'}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Facts({ p }: { p: NewProject }) {
  return (
    <div className={`grid gap-2 text-sm ${p.possession ? 'grid-cols-3' : 'grid-cols-2'}`}>
      <div className="rounded-xl bg-white/5 px-3 py-2.5">
        <p className="flex items-center gap-1 text-white/50 text-[0.6875rem] mb-0.5"><Building2 size={12} /> {t('projects.factType')}</p>
        <p className="text-white font-medium leading-tight">{p.configurations}</p>
      </div>
      <div className="rounded-xl bg-white/5 px-3 py-2.5">
        <p className="flex items-center gap-1 text-white/50 text-[0.6875rem] mb-0.5"><Ruler size={12} /> {t('projects.factSize')}</p>
        <p className="text-white font-medium leading-tight">{p.sizeRange}</p>
      </div>
      {p.possession && (
        <div className="rounded-xl bg-white/5 px-3 py-2.5">
          <p className="flex items-center gap-1 text-white/50 text-[0.6875rem] mb-0.5"><CalendarClock size={12} /> {t('projects.factPossession')}</p>
          <p className="text-white font-medium leading-tight">{p.possession}</p>
        </div>
      )}
    </div>
  );
}

export default function NewProjects() {
  const { projects } = useHomeViewModel();
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;

  return (
    <section className="relative py-20 lg:py-28 px-5 lg:px-8 bg-night overflow-hidden">
      <div className="absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative max-w-[1280px] mx-auto">
        <ScrollReveal className="mb-10 lg:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
              </span>
              {t('projects.eyebrow')}
            </p>
            <h2 className="font-display font-semibold text-white text-[clamp(1.875rem,3.5vw,2.75rem)] leading-tight tracking-tight">
              {rich('projects.title', { market: flavor.market }, 'text-gold-light')}
            </h2>
            <p className="text-white/65 mt-4 leading-relaxed">
              {t('projects.subtitle')}
            </p>
          </div>
          <a href={whatsappLink(t('projects.alertsMsg', { company: CONTACT.company }))} target="_blank" rel="noreferrer" className="neopop-btn neopop-btn-dark shrink-0 w-fit">
            <MessageCircle size={16} /> {t('projects.alerts')}
          </a>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Lead project */}
          <ScrollReveal>
            <article className="group h-full flex flex-col rounded-[2rem] bg-white/[0.04] border border-white/10 hover:border-gold/40 p-3 transition-colors">
              <div className="relative h-[340px] sm:h-[400px] rounded-2xl overflow-hidden">
                <img src={lead.image || images.placeholder} alt={lead.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow mb-3 ${STATUS_STYLE[lead.status]}`}>{t(`projects.status.${lead.status}`)}</span>
                    <h3 className="font-display font-semibold text-white text-3xl">{lead.name}</h3>
                    <p className="flex items-center gap-1.5 text-white/75 text-sm mt-1"><MapPin size={14} className="text-gold-light" /> {lead.location}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-white/60 text-xs">{t('projects.startingFrom')}</p>
                    <p className="font-display font-semibold text-gold-light text-3xl">{lead.startingPrice}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-5 p-4 pt-6">
                <Stepper status={lead.status} />
                <Facts p={lead} />
                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {lead.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-1.5 text-white/75 text-sm">
                      <Check size={14} className="text-gold-light" /> {h}
                    </li>
                  ))}
                </ul>
                <a href={enquire(lead)} target="_blank" rel="noreferrer" className="mt-auto flex items-center justify-center gap-2 rounded-full bg-gold text-white font-semibold py-3.5 hover:bg-gold-dark transition-colors">
                  <MessageCircle size={16} /> {t('projects.brochureLong')}
                </a>
              </div>
            </article>
          </ScrollReveal>

          {/* Other projects */}
          <div className="flex flex-col gap-6">
            {rest.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.08} className="flex-1">
                <article className="group h-full grid sm:grid-cols-[170px_1fr] gap-5 rounded-[2rem] bg-white/[0.04] border border-white/10 hover:border-gold/40 p-3 transition-colors">
                  <div className="relative h-48 sm:h-full min-h-[200px] rounded-2xl overflow-hidden">
                    <img src={p.image || images.placeholder} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                    <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[0.6875rem] font-semibold shadow ${STATUS_STYLE[p.status]}`}>{t(`projects.status.${p.status}`)}</span>
                  </div>
                  <div className="flex flex-col gap-4 py-2 pr-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display font-semibold text-white text-xl">{p.name}</h3>
                        <p className="flex items-center gap-1.5 text-white/60 text-sm mt-0.5"><MapPin size={13} className="text-gold-light" /> {p.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white/50 text-[0.6875rem]">{t('projects.from')}</p>
                        <p className="font-display font-semibold text-gold-light text-xl">{p.startingPrice}</p>
                      </div>
                    </div>
                    <Stepper status={p.status} />
                    <p className="text-white/70 text-sm">
                      {[p.configurations, p.sizeRange].filter(Boolean).join(' · ')}
                    </p>
                    <a href={enquire(p)} target="_blank" rel="noreferrer" className="mt-auto flex items-center justify-center gap-2 rounded-full bg-white text-fg text-sm font-semibold py-2.5 hover:bg-gold hover:text-white transition-colors">
                      <MessageCircle size={15} /> {t('projects.brochureShort')}
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
