import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, LayoutList, PlusCircle, Star, Users, User, Settings } from 'lucide-react';
import { CONTACT } from '@/core/config/contact';
import { useAdminAuth } from '@/features/admin/viewmodel/AdminAuthProvider';
import { t } from '@/core/utils/i18n';

const MENU = [
  { to: '/admin/home', label: t('admin.menu.home'), icon: Home },
  { to: '/admin/listings', label: t('admin.menu.listings'), icon: LayoutList },
  { to: '/admin/publish', label: t('admin.menu.publish'), icon: PlusCircle },
  { to: '/admin/reviews', label: t('admin.menu.reviews'), icon: Star },
  { to: '/admin/users', label: t('admin.menu.users'), icon: Users },
  { to: '/admin/profile', label: t('admin.menu.profile'), icon: User },
  { to: '/admin/settings', label: t('admin.menu.settings'), icon: Settings },
];

const titleFor = (path: string) => MENU.find((m) => path.startsWith(m.to))?.label ?? t('admin.title');

/** App bar + sidebar (desktop) / bottom navigation (mobile) around every signed-in admin page. */
export default function AdminLayout() {
  const { available, loading, user } = useAdminAuth();
  const { pathname } = useLocation();

  if (loading) return <div className="min-h-screen bg-ink-900 flex items-center justify-center text-ash">{t('admin.checkingSession')}</div>;
  if (!available || !user) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-ink-900">
      <header className="fixed inset-x-0 top-0 z-30 h-14 bg-white shadow-card flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {pathname.startsWith('/admin/publish') && (
            <Link to="/admin/listings" aria-label={t('admin.backToListings')} className="-ml-2 p-2 rounded-full text-fg hover:bg-ink-800 shrink-0">
              <ArrowLeft size={20} />
            </Link>
          )}
          <span className="font-display font-semibold text-fg truncate">{CONTACT.company}</span>
          <span className="text-ash text-sm hidden sm:inline">/ {titleFor(pathname)}</span>
        </div>
        <NavLink to="/admin/profile" className="flex items-center gap-2 text-sm text-ash hover:text-gold">
          <span className="hidden sm:inline">{user.name || user.username}</span>
          <span className="w-8 h-8 rounded-full bg-fg text-white flex items-center justify-center text-xs font-bold">
            {(user.name || user.username).charAt(0).toUpperCase()}
          </span>
        </NavLink>
      </header>

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-14 bottom-0 w-60 flex-col gap-1 bg-white border-r border-fg/10 p-3">
        {MENU.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? 'bg-fg text-white' : 'text-ash hover:bg-ink-800 hover:text-fg'
              }`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>

      <main className="pt-14 pb-20 lg:pb-8 lg:pl-60">
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 h-16 bg-white border-t border-fg/10 grid grid-cols-7">
        {MENU.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-semibold ${isActive ? 'text-gold' : 'text-ash'}`
            }
          >
            <Icon size={20} /> {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
