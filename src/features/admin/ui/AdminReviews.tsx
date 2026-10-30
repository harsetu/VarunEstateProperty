import { Pencil, Play, Plus, Quote, Trash2 } from 'lucide-react';
import { useAdminReviewsViewModel, type ReviewFilter } from '@/features/admin/viewmodel/useAdminReviewsViewModel';
import { REVIEW_TEXT_MAX, formatReviewDate, REVIEW_URL_MAX, isHttpUrl, parseVideoUrl, thumbnailUrl, type Review } from '@/features/reviews/model/review';
import ReviewVideo from '@/features/reviews/ui/ReviewVideo';
import Modal from '@/core/widgets/Modal';
import { t } from '@/core/utils/i18n';

const field = 'w-full rounded-lg border border-fg/15 bg-white px-3 py-2 text-sm text-fg focus:outline-none focus:border-gold';
const FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: 'All', label: t('reviews.all') },
  { value: 'TEXT', label: t('reviews.text') },
  { value: 'VIDEO', label: t('reviews.video') },
];

export default function AdminReviews() {
  const vm = useAdminReviewsViewModel();
  const d = vm.draft;

  if (!vm.available) return <p className="text-ash py-8 text-center">{t('reviews.notSetUp')}</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="font-display font-semibold text-fg text-2xl">{t('reviews.title')}</h1>
        <button onClick={vm.openAdd} className="neopop-btn"><Plus size={16} /> {t('reviews.add')}</button>
      </div>

      <div className="flex gap-1.5 mb-3" role="group" aria-label={t('reviews.filter')}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => vm.setFilter(f.value)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${vm.filter === f.value ? 'bg-fg text-white' : 'bg-white text-ash hover:text-fg shadow-card'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {vm.notice && <p role="status" className="text-emerald-600 text-sm mb-2">{vm.notice}</p>}
      {vm.status === 'ready' && <p className="text-ash text-sm mb-2">{vm.items.length === 1 ? t('reviews.countOne') : t('reviews.count', { count: vm.items.length })}</p>}
      {vm.status === 'loading' && <p className="text-ash text-sm mb-2">{t('reviews.loading')}</p>}
      {vm.status === 'denied' && <p role="alert" className="text-red-600 text-sm py-8 text-center">{t('reviews.denied')}</p>}
      {vm.status === 'error' && (
        <p className="text-red-600 text-sm mb-2">{t('reviews.loadError', { detail: vm.error ? ` (${vm.error})` : '' })} <button onClick={vm.reload} className="underline">{t('reviews.retry')}</button></p>
      )}

      <div className="space-y-2">
        {vm.items.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl bg-white shadow-card p-3">
            <Thumb review={r} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 mb-0.5">
                <span className={`rounded-full text-[0.65rem] font-bold px-2 py-0.5 ${r.type === 'VIDEO' ? 'bg-gold/15 text-gold' : 'bg-fg/10 text-fg'}`}>
                  {r.type === 'VIDEO' ? t('reviews.video') : t('reviews.text')}
                </span>
                <span className="text-xs text-ash">{formatReviewDate(r.createdAt)}</span>
              </span>
              <span className="block text-sm text-fg truncate">{(r.type === 'VIDEO' ? r.videoUrl : r.text) ?? ''}</span>
            </span>
            <button onClick={() => vm.openEdit(r)} aria-label={t('reviews.editAria')} className="p-2 rounded-full text-ash hover:bg-ink-800 hover:text-fg"><Pencil size={16} /></button>
            <button onClick={() => vm.askDelete(r)} aria-label={t('reviews.deleteAria')} className="p-2 rounded-full text-ash hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
          </div>
        ))}
        {vm.status === 'ready' && vm.items.length === 0 && <p className="text-ash py-8 text-center">{t('reviews.none')}</p>}
      </div>

      <Modal open={!!vm.editing} onClose={vm.saving ? () => {} : vm.closeForm} title={t(vm.editing?.id == null ? 'reviews.add' : 'reviews.edit')}>
        <form onSubmit={(e) => { e.preventDefault(); vm.submit(); }} className="space-y-4 -mt-2">
          <div>
            <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('reviews.type')}</span>
            <div className="flex gap-1 p-1 w-fit bg-ink-800 rounded-full">
              {(['TEXT', 'VIDEO'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => vm.pickType(type)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${d.type === type ? 'bg-fg text-white' : 'text-ash hover:text-fg'}`}
                >
                  {type === 'TEXT' ? t('reviews.text') : t('reviews.video')}
                </button>
              ))}
            </div>
          </div>

          {d.type === 'TEXT' ? (
            <label className="block">
              <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('reviews.textLabel')}</span>
              <textarea rows={6} maxLength={REVIEW_TEXT_MAX} className={field} placeholder={t('reviews.textPh')} value={d.text} onChange={(e) => vm.change({ text: e.target.value })} />
              <span className="block text-right text-xs text-ash mt-1">{t('reviews.counter', { count: d.text.length, max: REVIEW_TEXT_MAX })}</span>
            </label>
          ) : (
            <div>
              <label className="block">
                <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('reviews.videoLabel')}</span>
                <input type="url" inputMode="url" maxLength={REVIEW_URL_MAX} className={field} placeholder={t('reviews.videoPh')} value={d.videoUrl} onChange={(e) => vm.change({ videoUrl: e.target.value })} />
              </label>
              {isHttpUrl(d.videoUrl) && (
                <div className="mt-3">
                  <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('reviews.preview')}</span>
                  <div className="rounded-xl overflow-hidden"><ReviewVideo key={d.videoUrl} url={d.videoUrl} /></div>
                </div>
              )}
            </div>
          )}

          {vm.formError && <p role="alert" className="text-sm text-red-600">{vm.formError}</p>}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button type="button" onClick={vm.closeForm} disabled={vm.saving} className="neopop-btn neopop-btn-outline justify-center">{t('reviews.cancel')}</button>
            <button type="submit" disabled={vm.saving} className="neopop-btn justify-center disabled:opacity-60">{vm.saving ? t('reviews.saving') : t('reviews.save')}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!vm.deleting} onClose={vm.removing ? () => {} : vm.cancelDelete} title={t('reviews.deleteTitle')} subtitle={t('reviews.deleteBody')}>
        {vm.deleteError && <p role="alert" className="text-sm text-red-600 mb-3">{vm.deleteError}</p>}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end -mt-2">
          <button onClick={vm.cancelDelete} disabled={vm.removing} className="neopop-btn neopop-btn-outline justify-center">{t('reviews.cancel')}</button>
          <button onClick={vm.confirmDelete} disabled={vm.removing} className="neopop-btn justify-center !bg-red-600 !border-red-600 disabled:opacity-60">
            {vm.removing ? t('reviews.deleting') : t('reviews.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Thumb({ review }: { review: Review }) {
  const thumb = review.type === 'VIDEO' && review.videoUrl ? thumbnailUrl(parseVideoUrl(review.videoUrl)) : null;
  return (
    <span className="relative w-14 h-14 rounded-lg bg-ink-800 text-ash flex items-center justify-center shrink-0 overflow-hidden">
      {thumb && <img src={thumb} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
      {review.type === 'VIDEO' ? <Play size={18} className={thumb ? 'relative text-white drop-shadow fill-white' : ''} /> : <Quote size={18} />}
    </span>
  );
}
