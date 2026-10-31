import Hero from '@/features/home/ui/Hero';
import HeroVideo from '@/features/home/ui/HeroVideo';
import HeroCarousel from '@/features/home/ui/HeroCarousel';
import { useTheme } from '@/core/theme/ThemeProvider';
import Categories from '@/features/home/ui/Categories';
import NewProjects from '@/features/home/ui/NewProjects';
import WhyUs from '@/features/home/ui/WhyUs';
import Awards from '@/features/home/ui/Awards';
import AwardsMore from '@/features/home/ui/AwardsMore';
import Reviews from '@/features/home/ui/Reviews';
import CtaFooter from '@/features/home/ui/CtaFooter';

export default function Home() {
  const theme = useTheme();
  return (
    <>
      {theme === 'THEME2' ? <HeroVideo /> : theme === 'THEME3' ? <HeroCarousel /> : <Hero />}
      <Categories />
      <NewProjects />
      <Reviews />
      <Awards />
      <AwardsMore />
      <WhyUs />
      <CtaFooter />
    </>
  );
}
