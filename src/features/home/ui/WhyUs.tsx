import { ShieldCheck, FileText, BadgeIndianRupee, Handshake } from 'lucide-react';
import { useHomeContent } from '@/features/home/viewmodel/useHomeContent';
import Counter from '@/core/widgets/Counter';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import SectionHeading from '@/core/widgets/SectionHeading';
import { t } from '@/core/utils/i18n';
import { rich } from '@/core/utils/rich';
import { CONTACT } from '@/core/config/contact';
import flavor from '@/flavors';

const REASONS = [
  { icon: ShieldCheck, title: t('why.verified.title'), desc: t('why.verified.desc') },
  { icon: FileText, title: t('why.paperwork.title'), desc: t('why.paperwork.desc') },
  { icon: BadgeIndianRupee, title: t('why.pricing.title'), desc: t('why.pricing.desc') },
  { icon: Handshake, title: t('why.after.title'), desc: t('why.after.desc') },
];

export default function WhyUs() {
  const { stats: STATS } = useHomeContent();
  return (
    <section className="py-20 lg:py-28 bg-ink-900">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <SectionHeading
              eyebrow={t('why.eyebrow', { company: CONTACT.company })}
              title={rich('why.title')}
              subtitle={t('why.subtitle', { market: flavor.market })}
            />
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <ScrollReveal key={stat.label} from="left" delay={i * 0.08}>
                  <div className="rounded-lg bg-white shadow-card p-6">
                    <Counter value={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {REASONS.map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal key={title} from={i % 2 ? 'right' : 'scale'} delay={i * 0.1}>
                <div className="h-full rounded-lg border border-fg/10 bg-white/60 p-7 hover:bg-white hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-semibold text-fg text-xl mb-2">{title}</h3>
                  <p className="text-ash leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
