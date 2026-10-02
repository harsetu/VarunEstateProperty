import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';
import { STATS } from '@/data/properties';
import Counter from '@/components/Counter';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const img = imageRef.current;
    if (!img) return;

    const ctx = gsap.context(() => {
      gsap.to(img, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, img);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-ink-900 pt-28">
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div ref={imageRef} className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Luxury architecture"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/70 to-night/50" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <ScrollReveal>
            <p className="text-gold-light text-sm font-semibold uppercase tracking-[0.18em] mb-4">Our Story</p>
            <h1 className="font-display font-semibold text-white text-[clamp(2.25rem,6vw,4.5rem)] tracking-tight">
              About <span className="italic text-gold-light">Us</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display font-bold text-fg text-3xl lg:text-5xl tracking-tight mb-8">
              A Legacy of <span className="gold-gradient-text">Trust</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-ash text-lg leading-relaxed mb-6">
              For over 15 years, Varun Estate has been Panchkula's most trusted name in real estate.
              What began as a small family business has grown into one of the region's most respected
              property firms, serving over 500 families across Haryana.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-ash text-lg leading-relaxed mb-6">
              We believe that finding a home is not a transaction — it's the beginning of a story.
              That's why every property we list undergoes rigorous verification, every client gets
              personalized attention, and every deal is handled with absolute transparency.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-ash text-lg leading-relaxed">
              From kothis in Sector 4 to commercial spaces in MDC, we know Panchkula like no one else.
              Our deep local knowledge, combined with an unwavering commitment to quality, makes us
              the first choice for those who seek the best.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-ink-800 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal>
            <h2 className="font-display font-bold text-fg text-3xl lg:text-5xl tracking-tight mb-16 text-center">
              Our <span className="gold-gradient-text">Values</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Transparency', desc: 'No hidden costs, no surprises. Every detail is disclosed before you commit.' },
              { title: 'Quality', desc: 'We only list properties that meet our exacting standards. No compromises.' },
              { title: 'Trust', desc: 'Our clients are our family. We protect your interests as if they were our own.' },
            ].map((value, i) => (
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
          <h2 className="font-display font-semibold text-fg text-[clamp(1.875rem,4.5vw,3.75rem)] tracking-tight mb-8">
            Ready to Find <span className="gold-gradient-text">Your Home?</span>
          </h2>
          <Link to="/contact" className="neopop-btn">Get in Touch</Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
