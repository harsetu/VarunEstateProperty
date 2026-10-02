import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, PROPERTIES, formatINR } from '@/data/properties';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';

// Count and cheapest sale price for each property type
const STATS = Object.fromEntries(
  CATEGORIES.map((c) => {
    const list = PROPERTIES.filter((p) => p.type === c.name);
    const sale = list.filter((p) => p.purpose === 'Sale');
    const priced = sale.length ? sale : list;
    return [c.name, {
      count: list.length,
      from: priced.length ? formatINR(Math.min(...priced.map((p) => p.priceValue))) : null,
    }];
  }),
);

const linkFor = (name: string) => `/properties?type=${encodeURIComponent(name)}`;

export default function Categories() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-ink-900">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <SectionHeading
          eyebrow="Browse by type"
          title={<>What are you <em className="text-gold">looking for?</em></>}
          subtitle="From garden kothis to high-street showrooms — pick a door and step inside."
        />

        {/* Desktop: expanding arch panels */}
        <ScrollReveal className="hidden lg:flex gap-4 h-[540px]">
          {CATEGORIES.map((cat, i) => {
            const open = active === i;
            const stat = STATS[cat.name];
            return (
              <Link
                key={cat.name}
                to={linkFor(cat.name)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group relative overflow-hidden rounded-t-[320px] rounded-b-[2rem] shadow-card-hover transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? 'flex-[4.2]' : 'flex-[1]'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ${open ? 'scale-100' : 'scale-125'}`}
                />
                <div className={`absolute inset-0 transition-colors duration-500 ${open ? 'bg-gradient-to-t from-night/85 via-night/25 to-transparent' : 'bg-night/45 group-hover:bg-night/35'}`} />

                {/* collapsed: vertical label */}
                <div className={`absolute inset-0 flex flex-col items-center justify-between py-10 transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100 delay-200'}`}>
                  <span className="font-display text-white/70 text-sm">{cat.number}</span>
                  <span className="font-display font-semibold text-white text-2xl whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                    {cat.name}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/90 text-fg text-xs font-bold flex items-center justify-center">
                    {stat.count}
                  </span>
                </div>

                {/* expanded: full story */}
                <div className={`absolute inset-x-0 bottom-0 p-8 transition-all duration-500 ${open ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
                  <span className="font-display text-gold-light text-sm">{cat.number} / 0{CATEGORIES.length}</span>
                  <h3 className="font-display font-semibold text-white text-4xl mt-1">{cat.name}</h3>
                  <p className="text-white/75 mt-2 max-w-sm leading-relaxed">{cat.desc}</p>
                  <div className="flex items-center justify-between gap-4 mt-6">
                    <div className="flex gap-2 text-sm">
                      <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-white">{stat.count} listings</span>
                      {stat.from && <span className="rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-white">from {stat.from}</span>}
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-white text-fg font-semibold text-sm px-5 py-2.5 group-hover:bg-gold group-hover:text-white transition-colors whitespace-nowrap">
                      Explore <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </ScrollReveal>
      </div>

      {/* Mobile / tablet: swipeable arches */}
      <div className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-5 px-5 pb-4 [scrollbar-width:none]">
        {CATEGORIES.map((cat) => {
          const stat = STATS[cat.name];
          return (
            <Link
              key={cat.name}
              to={linkFor(cat.name)}
              className="relative snap-start shrink-0 w-[72%] sm:w-[44%] h-[420px] overflow-hidden rounded-t-[200px] rounded-b-[1.75rem] shadow-card-hover"
            >
              <img src={cat.image} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-display text-gold-light text-sm">{cat.number}</span>
                <h3 className="font-display font-semibold text-white text-3xl">{cat.name}</h3>
                <p className="text-white/75 text-sm mt-1 line-clamp-2">{cat.desc}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm leading-tight">
                    <span className="block text-white/70">{stat.count} listings</span>
                    {stat.from && <span className="block font-display font-semibold text-white text-lg">from {stat.from}</span>}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-white text-fg flex items-center justify-center"><ArrowUpRight size={16} /></span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
