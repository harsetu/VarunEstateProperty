import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, MapPin, Mail } from 'lucide-react';
import { CONTACT } from '@/core/config/contact';
import { SOCIAL_LINKS } from '@/core/utils/socialLinks';
import Logo from '@/core/widgets/Logo';
import { t } from '@/core/utils/i18n';

const NAV_LINKS = [
  { label: t('nav.home'), path: '/' },
  { label: t('nav.properties'), path: '/properties' },
  { label: t('nav.about'), path: '/about' },
  { label: t('nav.contact'), path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Transparent over the home hero until the page is scrolled
  const overHero = location.pathname === '/' && !scrolled && !open;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[5000]">
        {/* Top ribbon: collapses once the page is scrolled */}
        <div
          className={`bg-gold text-white font-medium overflow-hidden transition-[height] duration-300 ${
            scrolled ? 'h-0' : 'h-10'
          }`}
        >
          <div className="max-w-[1280px] mx-auto h-10 px-5 lg:px-8 flex items-center justify-between gap-4 text-[0.8125rem]">
            <div className="flex items-center gap-5 min-w-0">
              <span className="hidden sm:flex items-center gap-1.5 truncate">
                <MapPin size={14} className="shrink-0" /> {CONTACT.address}
              </span>
              <a href={CONTACT.phoneHref} className="flex items-center gap-1.5 hover:text-fg transition-colors shrink-0">
                <Phone size={14} /> {CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="hidden lg:flex items-center gap-1.5 hover:text-fg transition-colors">
                <Mail size={14} /> {CONTACT.email}
              </a>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`transition-colors duration-300 ${
            overHero ? 'bg-transparent' : 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(22,23,27,0.06)]'
          }`}
        >
        <nav className="max-w-[1280px] mx-auto px-5 lg:px-8 h-[72px] flex items-center justify-between">
          <Link to="/" aria-label={t('nav.homeAria', { company: CONTACT.company })}>
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[0.9375rem] font-medium transition-colors ${
                    active
                      ? 'text-gold'
                      : 'text-ash hover:text-fg'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={CONTACT.phoneHref}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                'bg-fg text-white hover:bg-gold'
              }`}
            >
              <Phone size={15} /> {CONTACT.phoneDisplay}
            </a>
          </div>

          <button
            className={`md:hidden text-fg`}
            onClick={() => setOpen(!open)}
            aria-label={t('nav.menu')}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[4999] bg-ink-900 md:hidden flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="font-display text-3xl text-fg hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a href={CONTACT.phoneHref} className="neopop-btn mt-4">
            <Phone size={16} /> {t('nav.callUs')}
          </a>
        </div>
      )}
    </>
  );
}
