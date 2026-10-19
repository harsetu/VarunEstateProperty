import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/core/layout/Navbar';
import Preloader from '@/core/layout/Preloader';
import Footer from '@/core/layout/Footer';
import WhatsAppButton from '@/core/layout/WhatsAppButton';
import CallbackPopup from '@/core/layout/CallbackPopup';
import Home from '@/features/home/ui/HomePage';
import Properties from '@/features/properties/ui/PropertiesPage';
import PropertyDetail from '@/features/properties/ui/PropertyDetailPage';
import About from '@/features/about/ui/AboutPage';
import Contact from '@/features/contact/ui/ContactPage';
import { t } from '@/core/utils/i18n';
import { CONTACT } from '@/core/config/contact';
import flavor from '@/flavors';
import { CatalogProvider } from '@/features/properties/viewmodel/CatalogProvider';
import { AdminAuthProvider } from '@/features/admin/viewmodel/AdminAuthProvider';
import AdminLogin from '@/features/admin/ui/AdminLogin';
import AdminListings from '@/features/admin/ui/AdminListings';
import AdminLayout from '@/features/admin/ui/AdminLayout';
import AdminHome from '@/features/admin/ui/AdminHome';
import AdminPublish from '@/features/admin/ui/AdminPublish';
import AdminUsers from '@/features/admin/ui/AdminUsers';
import AdminProfile from '@/features/admin/ui/AdminProfile';
import { analytics } from '@/core/analytics/analytics';

gsap.registerPlugin(ScrollTrigger);

function PageTransition() {
  const location = useLocation();

  useEffect(() => {
    // Start every new page at the top
    window.scrollTo({ top: 0, behavior: 'instant' });
    analytics.pageView(location.pathname);
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

// Public chrome is hidden on /admin pages
function SiteShell() {
  const isAdmin = useLocation().pathname.startsWith('/admin');
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/listings" element={<AdminListings />} />
          <Route path="/admin/publish" element={<AdminPublish />} />
          <Route path="/admin/publish/:id" element={<AdminPublish />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>
        <Route path="/admin/*" element={<AdminLogin />} />
      </Routes>
    );
  }
  return (
    <>
      <Preloader />
      <Navbar />
      <PageTransition />
      <Footer />
      <WhatsAppButton />
      <CallbackPopup />
    </>
  );
}

function App() {
  // The static <title> in index.html is only a fallback until this runs
  useEffect(() => {
    // Tab icon: the flavor's logo, else the default favicon from index.html
    if (flavor.logo) {
      document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href', flavor.logo);
    }
    document.title = t('meta.title', { company: CONTACT.company, market: flavor.market });
  }, []);

  return (
    <BrowserRouter>
      <CatalogProvider>
        <AdminAuthProvider>
          <SiteShell />
        </AdminAuthProvider>
      </CatalogProvider>
    </BrowserRouter>
  );
}

export default App;
