import { Plus, Trash2 } from 'lucide-react';
import { useNotesViewModel } from '@/presentation/viewmodels/useNotesViewModel';
import { t } from '@/i18n';

const field = 'w-full rounded-xl border border-fg/15 bg-white px-4 py-2.5 text-fg focus:outline-none focus:border-gold';

export default function AdminNotes() {
  const vm = useNotesViewModel();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-semibold text-fg text-2xl">{t('notes.title')}</h1>
        <button onClick={vm.startNew} className="neopop-btn"><Plus size={16} /> {t('notes.new')}</button>
      </div>
      <p className="text-ash text-xs mb-4">{t('notes.localOnly')}</p>

      {vm.editing && (
        <div className="rounded-2xl bg-white shadow-card p-4 mb-4 space-y-3">
          <input className={field} placeholder={t('notes.titlePh')} value={vm.editing.title} onChange={(e) => vm.change({ title: e.target.value })} />
          <textarea className={field} rows={6} placeholder={t('notes.bodyPh')} value={vm.editing.body} onChange={(e) => vm.change({ body: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={vm.save} className="neopop-btn">{t('notes.save')}</button>
            <button onClick={vm.cancel} className="neopop-btn neopop-btn-outline">{t('notes.cancel')}</button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {vm.notes.map((n) => (
          <div key={n.id} className="rounded-2xl bg-white shadow-card p-4">
            <button onClick={() => vm.edit(n)} className="text-left w-full">
              <p className="font-semibold text-fg">{n.title || t('notes.untitled')}</p>
              <p className="text-ash text-sm mt-1 line-clamp-4 whitespace-pre-wrap">{n.body}</p>
            </button>
            <div className="flex items-center justify-between mt-3 text-xs text-ash">
              {new Date(n.updatedAt).toLocaleString()}
              <button onClick={() => { if (window.confirm(t('notes.deleteConfirm'))) vm.remove(n.id); }} aria-label={t('notes.deleteAria')} className="hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {vm.notes.length === 0 && !vm.editing && <p className="text-ash">{t('notes.empty')}</p>}
      </div>
    </div>
  );
}
