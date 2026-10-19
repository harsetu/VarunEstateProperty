import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Plane, KeyRound, Check, ArrowRight } from 'lucide-react';
import { useCatalog } from '@/features/properties/viewmodel/CatalogProvider';
import type { Property } from '@/features/properties/model/property';
import SectionHeading from '@/core/widgets/SectionHeading';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';
import flavor from '@/flavors';
import { images } from '@/res';

interface Persona {
  id: string;
  label: string;
  icon: typeof Users;
  headline: string;
  points: string[];
  pick: (list: Property[]) => Property[];
  cta: { label: string; to: string };
}

const PERSONAS: Persona[] = [
  {
    id: 'family',
    label: t('fit.family.label'),
    icon: Users,
    headline: t('fit.family.headline'),
    points: [t('fit.family.p1'), t('fit.family.p2'), t('fit.family.p3')],
    pick: (l) => l.filter((p) => (p.bedrooms ?? 0) >= 3).sort((a, b) => (b.bedrooms ?? 0) - (a.bedrooms ?? 0)),
    cta: { label: t('fit.family.cta'), to: '/properties?purpose=Sale' },
  },
  {
    id: 'investor',
    label: t('fit.investor.label'),
    icon: TrendingUp,
    headline: t('fit.investor.headline'),
    points: [t('fit.investor.p1'), t('fit.investor.p2'), t('fit.investor.p3')],
    pick: (l) => l.filter((p) => p.type === 'Commercial' || p.type === 'Plot'),
    cta: { label: t('fit.investor.cta'), to: '/properties?type=Commercial' },
  },
  {
    id: 'nri',
    label: t('fit.nri.label'),
    icon: Plane,
    headline: t('fit.nri.headline', { market: flavor.market }),
    points: [t('fit.nri.p1'), t('fit.nri.p2'), t('fit.nri.p3')],
    pick: (l) => l.filter((p) => p.featured),
    cta: { label: t('fit.nri.cta'), to: '/contact' },
  },
  {
    id: 'first',
    label: t('fit.first.label'),
    icon: KeyRound,
    headline: t('fit.first.headline'),
    points: [t('fit.first.p1'), t('fit.first.p2'), t('fit.first.p3')],
    pick: (l) => l.filter((p) => p.priceValue < 1e7 && p.type !== 'Commercial').sort((a, b) => a.priceValue - b.priceValue),
    cta: { label: t('fit.first.cta'), to: '/properties?purpose=Sale' },
  },
];

export default function FindYourFit() {
  const [activeId, setActiveId] = useState(PERSONAS[0].id);
  const persona = PERSONAS.find((p) => p.id === activeId)!;
  const { properties } = useCatalog();
  const matches = persona.pick([...properties]).slice(0, 2);

  return (
    <section className="py-20 lg:py-28 bg-ink-900">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <SectionHeading
          center
          eyebrow={t('fit.eyebrow')}
          title={rich('fit.title')}
        />

        <div role="tablist" className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {PERSONAS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeId === id}
              onClick={() => setActiveId(id)}
              className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold border transition-all ${
                activeId === id
                  ? 'bg-fg text-white border-fg shadow-card-hover -translate-y-0.5'
                  : 'bg-white text-ash border-fg/10 hover:text-fg hover:border-fg/30'
              }`}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>

        <div key={persona.id} className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12 items-center rounded-[2rem] bg-white shadow-card p-6 sm:p-10 animate-[fitIn_0.45s_cubic-bezier(0.22,1,0.36,1)]">
          <div>
            <div className="w-14 h-14 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-5">
              <persona.icon size={26} />
            </div>
            <h3 className="font-display font-semibold text-fg text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">{persona.headline}</h3>
            <ul className="mt-6 space-y-3">
              {persona.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-fg/80">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-gold text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
            <Link to={persona.cta.to} className="neopop-btn mt-8">
              {persona.cta.label} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {matches.map((p, i) => (
              <Link
                key={p.id}
                to={`/properties/${p.id}`}
                className={`group relative block rounded-[1.5rem] overflow-hidden aspect-[3/4] shadow-card-hover ${i === 1 ? 'sm:translate-y-8' : ''}`}
              >
                <img src={p.images[0] ?? images.placeholder} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-white/70 text-xs">{p.sector} · {p.area}</p>
                  <p className="font-display font-semibold text-white text-lg leading-snug mt-0.5">{p.title}</p>
                  <p className="font-display font-semibold text-gold-light text-xl mt-1">{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fitIn { from { opacity: 0; transform: translateY(14px); } }`}</style>
    </section>
  );
}
