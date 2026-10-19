import { Link } from 'react-router-dom';
import { Pencil, Search, Star, Trash2 } from 'lucide-react';
import { LABELS } from '@/features/properties/model/property';
import { useAdminListingsViewModel } from '@/features/admin/viewmodel/useAdminListingsViewModel';
import ConfirmDialog from '@/core/widgets/ConfirmDialog';
import { t } from '@/core/utils/i18n';
import { images } from '@/res';

const field = 'rounded-lg border border-fg/15 bg-white px-2.5 py-1.5 text-sm text-fg focus:outline-none focus:border-gold';

export default function AdminListings() {
  const vm = useAdminListingsViewModel();

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="font-display font-semibold text-fg text-2xl">{t('alist.title')}</h1>
        <Link to="/admin/publish" className="neopop-btn">{t('alist.publish')}</Link>
      </div>

      <div className="rounded-xl bg-white shadow-card p-2 flex flex-wrap items-center gap-2 mb-3">
        <label className="relative flex-1 min-w-[160px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ash" />
          <input value={vm.query} onChange={(e) => vm.setQuery(e.target.value)} placeholder={t('alist.search')}
            className={`${field} w-full pl-8`} />
        </label>
        <select value={vm.type} onChange={(e) => vm.setType(e.target.value)} className={field} aria-label={t('alist.type')}>
          {vm.types.map((opt) => <option key={opt} value={opt}>{opt === 'All' ? t('alist.allTypes') : opt}</option>)}
        </select>
        <select value={vm.sector} onChange={(e) => vm.setSector(e.target.value)} className={field} aria-label={t('alist.sector')}>
          {vm.sectors.map((s) => <option key={s} value={s}>{s === 'All' ? t('alist.allSectors') : s}</option>)}
        </select>
        <select value={vm.purpose} onChange={(e) => vm.setPurpose(e.target.value)} className={field} aria-label={t('alist.purpose')}>
          <option value="All">{t('alist.saleAndRent')}</option>
          <option value="Sale">{t('alist.forSale')}</option>
          <option value="Rent">{t('alist.forRent')}</option>
        </select>
        <select value={vm.label} onChange={(e) => vm.setLabel(e.target.value)} className={field} aria-label={t('listings.label')}>
          <option value="All">{t('listings.allLabels')}</option>
          {LABELS.map((l) => <option key={l} value={l}>{t(`label.${l}`)}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-fg whitespace-nowrap">
          <input type="checkbox" checked={vm.featuredOnly} onChange={(e) => vm.setFeaturedOnly(e.target.checked)} /> {t('alist.featuredOnly')}
        </label>
        {vm.filtersActive && (
          <button onClick={vm.clear} className="text-xs text-gold font-semibold">{t('alist.clear')}</button>
        )}
      </div>

      <p className="text-ash text-sm mb-3">{t('alist.showing', { shown: vm.results.length, total: vm.total })}</p>

      {vm.status === 'error' && (
        <p className="text-red-600 text-sm mb-3">{t('alist.loadError', { detail: vm.error ? ` (${vm.error})` : '' })} <button onClick={vm.reload} className="underline">{t('alist.retry')}</button></p>
      )}

      {vm.notice && <p role="status" className="text-emerald-600 text-sm mb-3">{vm.notice}</p>}

      <div className="space-y-2">
        {vm.results.map((p) => (
          <div key={p.id} className="flex items-center gap-1 rounded-xl bg-white shadow-card pr-2 hover:ring-1 hover:ring-gold">
            <Link to={`/admin/publish/${p.id}`} className="flex flex-1 min-w-0 items-center gap-3 p-2 pr-3">
              <img src={p.images[0] ?? images.placeholder} alt="" className="w-16 h-16 rounded-lg object-cover bg-ink-800 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                  <span className="truncate">{p.title}</span>
                  {p.featured && <Star size={13} className="text-gold fill-gold shrink-0" />}
                </span>
                <span className="block text-xs text-ash">{p.type} · {p.purpose} · {p.sector}</span>
              </span>
              <span className="text-sm font-display font-semibold text-gold hidden sm:block">{p.price}</span>
              <Pencil size={16} className="text-ash shrink-0" />
            </Link>
            <button onClick={() => vm.askDelete(p)} aria-label={t('alist.delete', { title: p.title })} className="p-2 rounded-lg text-ash hover:text-red-600 hover:bg-red-50">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {vm.status === 'ready' && vm.results.length === 0 && <p className="text-ash py-8 text-center">{t('alist.none')}</p>}
      </div>

      <ConfirmDialog
        open={vm.pendingDelete !== null}
        title={t('confirm.deleteTitle')}
        message={t('confirm.deleteBody', { title: vm.pendingDelete?.title ?? '' })}
        confirmLabel={vm.deleting ? t('confirm.deleting') : t('confirm.delete')}
        busy={vm.deleting}
        error={vm.deleteError}
        onCancel={vm.cancelDelete}
        onConfirm={vm.confirmDelete}
      />
    </div>
  );
}
