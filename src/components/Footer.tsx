import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT, SOCIAL_LINKS } from '@/data/contact';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="relative bg-ink-800 border-t border-fg/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Logo className="mb-5" />
            <p className="text-ash text-sm leading-relaxed">
              Your trusted property partner in Panchkula — kothis, plots, floors, flats and commercial spaces.
            </p>
            <p className="text-fg text-sm font-medium mt-4">{CONTACT.person}</p>
          </div>

          <div>
            <h4 className="text-fg font-semibold text-sm uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-ash hover:text-gold text-sm transition-colors">Home</Link></li>
              <li><Link to="/properties" className="text-ash hover:text-gold text-sm transition-colors">Properties</Link></li>
              <li><Link to="/about" className="text-ash hover:text-gold text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-ash hover:text-gold text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-fg font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-ash text-sm">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex items-start gap-2 text-ash text-sm">
                <Phone size={16} className="text-gold shrink-0 mt-0.5" />
                <span className="flex flex-col gap-1">
                  {CONTACT.phones.map((ph) => (
                    <a key={ph.href} href={ph.href} className="hover:text-gold transition-colors">{ph.display}</a>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-2 text-ash text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold transition-colors break-all">{CONTACT.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-fg font-semibold text-sm uppercase tracking-wider mb-4">Follow</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="w-10 h-10 rounded-full flex items-center justify-center border border-fg/10 text-ash hover:text-gold hover:border-gold transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-fg/5 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ash-dark text-xs">© 2026 Pahwa Real Estate. All rights reserved.</p>
          <p className="text-ash-dark text-xs">{CONTACT.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
