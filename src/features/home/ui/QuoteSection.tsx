import { useEffect, useRef, useState } from 'react';
import { useHomeContent } from '@/features/home/viewmodel/useHomeContent';

export default function QuoteSection() {
  const { quotes: QUOTES, quoteVideo: QUOTE_VIDEO } = useHomeContent();
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          src={QUOTE_VIDEO.url}
          poster={QUOTE_VIDEO.poster}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-ink-900/70" />
      </div>

      <div className="relative z-10 max-w-5xl px-6 text-center">
        {QUOTES.map((quote, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <blockquote className="font-display font-medium text-fg text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[1.2] tracking-tight">
              <span className="text-gold">"</span>
              {quote}
              <span className="text-gold">"</span>
            </blockquote>
          </div>
        ))}

        <div className="flex justify-center gap-2 mt-12 relative" style={{ height: 'auto' }}>
          {QUOTES.map((_, i) => (
            <div
              key={i}
              className="h-1 transition-all duration-500"
              style={{
                width: i === index ? 40 : 16,
                backgroundColor: i === index ? 'rgb(var(--c-gold))' : 'rgb(var(--c-fg) / 0.18)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
