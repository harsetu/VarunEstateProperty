import { t } from '@/core/utils/i18n';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import { useAboutViewModel } from '@/features/about/viewmodel/useAboutViewModel';
import Counter from '@/core/widgets/Counter';

export default function About() {
  const { stats: STATS, company, market, owner } = useAboutViewModel();

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      <section className="relative overflow-hidden bg-night py-24 lg:py-32 px-6 text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full bg-gold/20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 pointer-events-none" />
        <ScrollReveal className="relative">
          <p className="text-gold-light text-sm font-bold uppercase tracking-[0.2em] mb-5">{t('about.eyebrow')}</p>
          <h1 className="font-display font-bold uppercase text-white text-[clamp(2rem,5.5vw,4rem)] tracking-wide">
            {t('about.title')} <span className="font-script not-italic font-normal text-gold-light text-[1.3em] leading-none normal-case">{t('about.titleEm')}</span>
          </h1>
        </ScrollReveal>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display font-light text-fg text-3xl lg:text-5xl mb-8">
              {t('about.legacy')} <span className="font-script not-italic font-normal text-gold-dark text-[1.25em] leading-none">{t('about.legacyEm')}</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-ash-light text-lg leading-relaxed mb-6">
              {t('about.p1', { company, market })}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-ash-light text-lg leading-relaxed mb-6">
              {t('about.p2')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-ash-light text-lg leading-relaxed">
              {t('about.p3', { market })}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {owner && (
        <section className="py-20 px-6 lg:px-12 bg-ink-800">
          <ScrollReveal>
            <div className="max-w-5xl mx-auto grid sm:grid-cols-[minmax(0,320px)_1fr] gap-8 sm:gap-14 items-center">
              <img
                src={owner.photo}
                alt={t('about.ownerAlt', { name: owner.name })}
                className="w-full max-w-[320px] mx-auto aspect-[3/4] object-cover object-top rounded-lg shadow-card-hover"
              />
              <div className="text-center sm:text-left">
                <p className="text-gold-dark text-sm font-bold uppercase tracking-[0.2em] mb-3">{t('about.ownerEyebrow')}</p>
                <h2 className="font-display font-light text-fg text-3xl lg:text-5xl">{owner.name}</h2>
                <p className="text-ash-light text-lg mt-2">{t('about.ownerRole')} · {company}</p>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      <section className="py-24 bg-ink-800 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal>
            <h2 className="font-display font-light text-fg text-3xl lg:text-5xl mb-16 text-center">
              {t('about.values')} <span className="font-script not-italic font-normal text-gold-dark text-[1.25em] leading-none">{t('about.valuesEm')}</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: t('about.v1.title'), desc: t('about.v1.desc') },
              { title: t('about.v2.title'), desc: t('about.v2.desc') },
              { title: t('about.v3.title'), desc: t('about.v3.desc') },
            ].map((value, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-white border border-fg/10 rounded-lg p-8 h-full hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="font-display font-light text-gold-dark text-5xl mb-4">0{i + 1}</div>
                  <h3 className="font-display font-bold text-fg text-xl mb-3">{value.title}</h3>
                  <p className="text-ash leading-relaxed">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-ink-900 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {STATS.map((stat, i) => (
              <Counter key={i} value={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-ink-800 px-6 text-center">
        <ScrollReveal>
          <h2 className="font-display font-light text-fg text-[clamp(2rem,4.5vw,3.5rem)] mb-8">
            {t('about.ready')} <span className="font-script not-italic font-normal text-gold-dark text-[1.25em] leading-none">{t('about.readyEm')}</span>
          </h2>
          <Link to="/contact" className="neopop-btn !rounded-lg">{t('about.getInTouch')}</Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
