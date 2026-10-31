import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';

const HL = 'not-italic font-semibold text-fg bg-gold/15 rounded px-1 py-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { useAboutViewModel } from '@/features/about/viewmodel/useAboutViewModel';

export default function About() {
  const { company, market, owner } = useAboutViewModel();

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      <section className="py-20 lg:py-28 px-6 text-center bg-ink-800">
        <ScrollReveal>
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.18em] mb-4">{t('about.eyebrow')}</p>
          <h1 className="font-display font-semibold text-fg text-[clamp(2.25rem,6vw,4.5rem)] tracking-tight">
            {t('about.title')} <span className="italic gold-gradient-text">{company} Real Estate</span>
          </h1>
          <p className="text-ash text-lg lg:text-xl max-w-2xl mx-auto mt-6">{rich('about.tagline', undefined, HL)}</p>
        </ScrollReveal>
      </section>

      {owner && (
        <section className="pb-20 pt-2 px-6 lg:px-12 bg-ink-800">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto grid sm:grid-cols-[minmax(0,260px)_1fr] gap-8 sm:gap-12 items-center">
              <img
                src={owner.photo}
                alt={t('about.ownerAlt', { name: owner.name })}
                className="w-full max-w-[260px] mx-auto aspect-[3/4] object-cover object-top rounded-[2rem] shadow-card-3d border-[6px] border-white"
              />
              <div className="text-center sm:text-left">
                <p className="text-gold text-sm font-semibold uppercase tracking-[0.18em] mb-3">{t('about.ownerEyebrow')}</p>
                <h2 className="font-display font-bold text-fg text-3xl lg:text-5xl tracking-tight">{owner.name}</h2>
                <p className="text-ash text-lg mt-2">{t('about.ownerRole')} · {company}</p>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal delay={0.1}>
            <p className="text-ash text-lg leading-relaxed mb-6">
              {rich('about.p1', { company, market }, HL)}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-ash text-lg leading-relaxed mb-6">
              {rich('about.p2', undefined, HL)}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-ash text-lg leading-relaxed">
              {rich('about.p3', { market }, HL)}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-ink-800 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal>
            <h2 className="font-display font-bold text-fg text-3xl lg:text-5xl tracking-tight mb-16 text-center">
              {t('about.values')} <span className="gold-gradient-text">{t('about.valuesEm')}</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((n) => ({ title: t(`about.v${n}.title`), desc: t(`about.v${n}.desc`, { market }) })).map((value, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-ink-700 border border-fg/8 p-8 h-full">
                  <div className="font-display font-semibold text-gold text-5xl mb-4">0{i + 1}</div>
                  <h3 className="font-display font-bold text-fg text-xl tracking-tight mb-3">{value.title}</h3>
                  <p className="text-ash leading-relaxed">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12 bg-ink-900">
        <ScrollReveal>
          <p className="max-w-3xl mx-auto text-center font-display text-fg text-2xl lg:text-3xl leading-snug">{rich('about.belief', { company }, 'not-italic text-gold')}</p>
        </ScrollReveal>
      </section>

      <section className="py-24 lg:py-32 bg-ink-800 px-6 text-center">
        <ScrollReveal>
          <h2 className="font-display font-semibold text-fg text-[clamp(1.875rem,4.5vw,3.75rem)] tracking-tight mb-8">
            {t('about.ready', { company })} <span className="gold-gradient-text">{t('about.readyEm')}</span>
          </h2>
          <Link to="/contact" className="neopop-btn">{t('about.getInTouch')}</Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
