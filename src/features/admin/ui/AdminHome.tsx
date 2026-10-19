import { Link } from 'react-router-dom';
import { Bath, Bed, LayoutList, PlusCircle, Users } from 'lucide-react';
import { useAdminAuth } from '@/features/admin/viewmodel/AdminAuthProvider';
import { useAdminDashboardViewModel } from '@/features/admin/viewmodel/useAdminDashboardViewModel';
import { t } from '@/core/utils/i18n';

export default function AdminHome() {
  const { user } = useAdminAuth();
  const vm = useAdminDashboardViewModel();
  const loading = vm.status === 'loading';

  const tiles = [
    { label: t('home.total'), value: vm.totals?.total },
    { label: t('home.forSale'), value: vm.totals?.forSale },
    { label: t('home.forRent'), value: vm.totals?.forRent },
  ];

  return (
    <div>
      <h1 className="font-display font-semibold text-fg text-2xl">{t('home.welcome', { name: user?.name || user?.username || '' })}</h1>
      <p className="text-ash text-sm mt-1">{t('home.intro')}</p>

      {vm.status === 'error' && (
        <p className="text-red-600 text-sm mt-4" role="alert">
          {t('home.loadError', { detail: vm.error ? ` (${vm.error})` : '' })}{' '}
          <button onClick={vm.reload} className="underline">{t('home.retry')}</button>
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mt-6">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl bg-white shadow-card p-4 sm:p-5">
            <p className="text-3xl font-display font-semibold text-fg">{loading || t.value === undefined ? '–' : t.value}</p>
            <p className="text-ash text-sm mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { to: '/admin/publish', icon: PlusCircle, label: t('home.publish') },
          { to: '/admin/listings', icon: LayoutList, label: t('home.manage') },
          { to: '/admin/users', icon: Users, label: t('home.users') },
        ].map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex items-center gap-3 rounded-2xl bg-white shadow-card p-4 font-semibold text-fg hover:text-gold">
            <Icon size={20} className="text-gold" /> {label}
          </Link>
        ))}
      </div>

      <h2 className="font-semibold text-fg mt-8 mb-3">{t('home.recent')}</h2>
      <div className="space-y-2">
        {vm.recent.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white shadow-card p-2 pr-4">
            {p.image
              ? <img src={p.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-ink-800 shrink-0" />
              : <div className="w-16 h-16 rounded-lg bg-ink-800 shrink-0" />}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-fg truncate">{p.title}</span>
              <span className="block text-xs text-ash truncate">{t('home.recentLine', { category: p.category, listing: p.listing.toLowerCase(), place: p.place })}</span>
              <span className="flex items-center gap-3 text-xs text-ash mt-0.5">
                {p.area}
                {p.beds ? <span className="flex items-center gap-1"><Bed size={12} />{p.beds}</span> : null}
                {p.baths ? <span className="flex items-center gap-1"><Bath size={12} />{p.baths}</span> : null}
              </span>
            </span>
            <span className="text-sm font-display font-semibold text-gold shrink-0">{p.price}</span>
          </div>
        ))}
        {vm.status === 'ready' && vm.recent.length === 0 && <p className="text-ash">{t('home.noProperties')}</p>}
      </div>
    </div>
  );
}
