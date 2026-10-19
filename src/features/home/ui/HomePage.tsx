import Hero from '@/features/home/ui/Hero';
import Categories from '@/features/home/ui/Categories';
import NewProjects from '@/features/home/ui/NewProjects';
import SectorMap from '@/features/home/ui/SectorMap';
import FindYourFit from '@/features/home/ui/FindYourFit';
import WhyUs from '@/features/home/ui/WhyUs';
import Process from '@/features/home/ui/Process';
import Testimonials from '@/features/home/ui/Testimonials';
import CtaFooter from '@/features/home/ui/CtaFooter';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <NewProjects />
      <SectorMap />
      <FindYourFit />
      <WhyUs />
      <Process />
      <Testimonials />
      <CtaFooter />
    </>
  );
}
