import { PROCESS_STEPS } from '@/data/properties';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

export default function Process() {
  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8 bg-ink-800">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading
          center
          eyebrow="How it works"
          title={<>From first call to <em className="text-gold">your keys</em></>}
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
