import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import Preloader from '@/components/Preloader';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CallbackPopup from '@/components/CallbackPopup';
import Home from '@/pages/Home';
import Properties from '@/pages/Properties';
import PropertyDetail from '@/pages/PropertyDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

gsap.registerPlugin(ScrollTrigger);

function PageTransition() {
  const location = useLocation();

  useEffect(() => {
    // Start every new page at the top
    window.scrollTo({ top: 0, behavior: 'instant' });
    ScrollTrigger.refresh();
  }, [location.pathname]);

  // Keyed wrapper unmounts the whole old page in one go, and Routes gets the
  // same location so the old page never re-renders into the new route.
  return (
    <div key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <Navbar />
      <PageTransition />
      <Footer />
      <WhatsAppButton />
      <CallbackPopup />
    </BrowserRouter>
  );
}

export default App;
