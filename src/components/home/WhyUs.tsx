import { ShieldCheck, FileText, BadgeIndianRupee, Handshake } from 'lucide-react';
import { STATS } from '@/data/properties';
import Counter from '@/components/Counter';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

const REASONS = [
  { icon: ShieldCheck, title: 'Verified listings only', desc: 'Every property is site-inspected and title-checked before we show it to you.' },
  { icon: FileText, title: 'Paperwork handled', desc: 'Registry, mutation, NOCs and loan documents — our team takes care of it.' },
  { icon: BadgeIndianRupee, title: 'Fair, transparent pricing', desc: 'Real market rates and no hidden charges. You see exactly what you pay.' },
  { icon: Handshake, title: 'With you after the deal', desc: 'From keys to interiors and rentals, we stay a phone call away.' },
];

export default function WhyUs() {
  return (
    <section className="py-20 lg:py-28 px-5 lg:px-8 bg-ink-900">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <SectionHeading
              eyebrow="Why Varun Estate"
              title={<>Buying property should feel <em className="text-gold">safe</em>, not stressful</>}
              subtitle="For over 15 years, families across Panchkula have trusted us with the biggest purchase of their lives. Here's why they come back — and send their friends."
            />
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="rounded-2xl bg-white shadow-card p-6">
                  <Counter value={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {REASONS.map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-fg/10 bg-white/60 p-7 hover:bg-white hover:shadow-card transition-all">
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
