import { useHomeContent } from '@/features/home/viewmodel/useHomeContent';
import ScrollReveal from '@/core/widgets/ScrollReveal';
import SectionHeading from '@/core/widgets/SectionHeading';
import { rich } from '@/core/utils/rich';
import { t } from '@/core/utils/i18n';

export default function Process() {
  const { processSteps: PROCESS_STEPS } = useHomeContent();
  return (
    <section className="py-20 lg:py-28 bg-ink-800">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <SectionHeading
          center
          eyebrow={t('process.eyebrow')}
          title={rich('process.title')}
        />

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gold/30" />
          {PROCESS_STEPS.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.08} className="relative text-center px-4">
              <div className="relative mx-auto w-14 h-14 rounded-full bg-white shadow-card border border-gold/30 flex items-center justify-center font-display font-semibold text-gold text-lg mb-5">
                {step.number}
              </div>
              <h3 className="font-display font-semibold text-fg text-xl mb-2">{step.title}</h3>
              <p className="text-ash leading-relaxed">{step.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
