import { useCallback, useEffect, useState } from 'react';
import Fireworks from '@/core/widgets/Fireworks';
import { CELEBRATE_KEY } from '@/features/launch/ui/LaunchPage';
import Hero from '@/features/home/ui/Hero';
import HeroVideo from '@/features/home/ui/HeroVideo';
import HeroCarousel from '@/features/home/ui/HeroCarousel';
import { useTheme } from '@/core/theme/ThemeProvider';
import Categories from '@/features/home/ui/Categories';
import NewProjects from '@/features/home/ui/NewProjects';
import WhyUs from '@/features/home/ui/WhyUs';
import Awards from '@/features/home/ui/Awards';
import Reviews from '@/features/home/ui/Reviews';
import CtaFooter from '@/features/home/ui/CtaFooter';

export default function Home() {
  const theme = useTheme();
  // Arriving from /launch starts the firework show once
  const [celebrate, setCelebrate] = useState(() => {
    try { return sessionStorage.getItem(CELEBRATE_KEY) === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { sessionStorage.removeItem(CELEBRATE_KEY); } catch { /* ignore */ }
  }, []);
  const done = useCallback(() => setCelebrate(false), []);
  return (
    <>
      {celebrate && <Fireworks onDone={done} />}
      {theme === 'THEME2' ? <HeroVideo /> : theme === 'THEME3' ? <HeroCarousel /> : <Hero />}
      <Categories />
      <NewProjects />
      <Reviews />
      <Awards />
      <WhyUs />
      <CtaFooter />
    </>
  );
}
