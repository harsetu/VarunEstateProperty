import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHomeViewModel } from '@/features/home/viewmodel/useHomeViewModel';
import { HERO_VIDEO_LOCAL } from '@/core/config/heroMedia';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';

/** THEME2 home banner: full-screen looping video, centred headline, three facts along the bottom. */
export default function HeroVideo() {
  const { hero, content } = useHomeViewModel();
  const [failed, setFailed] = useState(false);
  const { url, poster } = content.heroVideo;

  const stats = [
    { value: `${hero.count}+`, label: t('herov.stat1') },
    { value: t('hero.invest'), label: t('herov.statDesc') },
    { value: t('herov.stat3'), label: t('herov.statDesc') },
  ];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-night text-white flex flex-col">
      <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
      {!failed && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEO_LOCAL} type="video/mp4" />
          <source src={url} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/35 to-night/80" />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-5 pt-40 pb-16">
        <h1 className="hero-in font-display font-bold uppercase text-[clamp(1.9rem,5vw,3.75rem)] leading-tight tracking-tight max-w-4xl">
          {t('herov.title1', { market: flavor.market.toUpperCase() })}
        </h1>
        <p className="hero-in [animation-delay:120ms] font-display italic text-gold-light text-[clamp(2rem,5.5vw,4rem)] leading-none mt-2">
          {t('herov.title2')}
        </p>
        <div className="hero-in [animation-delay:240ms] mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/properties" className="neopop-btn !bg-gold !border-gold hover:!bg-gold-dark">{t('herov.cta')}</Link>
          <Link to="/contact" className="neopop-btn neopop-btn-dark">{t('herov.cta2')}</Link>
        </div>
      </div>

      <div className="relative border-t border-white/20 bg-night/40 backdrop-blur-sm">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/20 text-center">
          {stats.map((s) => (
            <div key={s.label + s.value} className="px-4 py-5">
              <p className="font-display font-bold text-lg">{s.value}</p>
              <p className="text-white/65 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
