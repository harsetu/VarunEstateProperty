import { useHomeContent } from '@/features/home/viewmodel/useHomeContent';
import Counter from '@/core/widgets/Counter';

export default function Stats() {
  const { stats: STATS } = useHomeContent();
  return (
    <section className="relative py-24 lg:py-32 bg-ink-800 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="relative">
              <Counter value={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
              {i < STATS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
