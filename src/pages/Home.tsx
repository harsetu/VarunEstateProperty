import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import NewProjects from '@/components/home/NewProjects';
import SectorMap from '@/components/home/SectorMap';
import FindYourFit from '@/components/home/FindYourFit';
import WhyUs from '@/components/home/WhyUs';
import Process from '@/components/home/Process';
import Testimonials from '@/components/home/Testimonials';
import CtaFooter from '@/components/home/CtaFooter';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProperties />
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
