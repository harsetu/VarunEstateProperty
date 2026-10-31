import { useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Plus, Star, Trash2, Upload, X } from 'lucide-react';
import type { PropertyType, Purpose } from '@/domain/property';
import type { usePropertyEditorViewModel } from '@/presentation/viewmodels/usePropertyEditorViewModel';
import { t } from '@/i18n';

type VM = ReturnType<typeof usePropertyEditorViewModel>;

const field = 'w-full rounded-xl border border-fg/15 bg-white px-4 py-2.5 text-fg focus:outline-none focus:border-gold';
const iconBtn = 'p-1.5 rounded-lg bg-white/90 text-fg hover:text-gold disabled:opacity-40 shadow-card';

const Label = ({ text, children, className = '' }: { text: string; children: ReactNode; className?: string }) => (
  <label className={`block ${className}`}>
    <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{text}</span>
    {children}
  </label>
);

const numberOrUndefined = (v: string) => (v === '' ? undefined : Number(v));

export default function PropertyForm({ vm }: { vm: VM }) {
  const { draft: d } = vm;
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [amenity, setAmenity] = useState('');
  if (!d) return <p className="text-ash">Loading…</p>;

  const addAmenity = () => { vm.addAmenity(amenity); setAmenity(''); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display font-semibold text-fg text-xl">{vm.isNew ? t('form.newListing') : t('form.editListing')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { if (vm.isNew || window.confirm(t('form.deleteConfirm', { title: d.title }))) vm.remove(); }}
            disabled={vm.busy}
            className="neopop-btn neopop-btn-outline !text-red-600 disabled:opacity-50"
          >
            <Trash2 size={16} /> {vm.isNew ? t('form.discard') : t('form.delete')}
          </button>
          <button onClick={vm.save} disabled={!vm.dirty || vm.busy} className="neopop-btn disabled:opacity-50">
            {vm.busy ? t('form.working') : t('form.save')}
          </button>
        </div>
      </div>

      {vm.message && (
        <p role="status" className={`text-sm mb-4 ${vm.message.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
          {vm.message.text}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Label text={t('form.title')} className="sm:col-span-2">
          <input className={field} value={d.title} onChange={(e) => vm.setField('title', e.target.value)} placeholder={t('form.titlePh')} />
        </Label>
        <Label text={t('form.type')}>
          <select className={field} value={d.type} onChange={(e) => vm.setField('type', e.target.value as PropertyType)}>
            {vm.types.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </Label>
        <Label text={t('form.for')}>
          <select className={field} value={d.purpose} onChange={(e) => vm.setField('purpose', e.target.value as Purpose)}>
            <option value="Sale">{t('form.sale')}</option>
            <option value="Rent">{t('form.rent')}</option>
          </select>
        </Label>
        <Label text={t('form.sector')}>
          <input className={field} list="sector-options" value={d.sector} onChange={(e) => vm.setField('sector', e.target.value)} />
          <datalist id="sector-options">{vm.sectors.map((s) => <option key={s} value={s} />)}</datalist>
        </Label>
        <Label text={t('form.size')}>
          <input className={field} value={d.area} onChange={(e) => vm.setField('area', e.target.value)} placeholder={t('form.sizePh')} />
        </Label>
        <Label text={t('form.price')}>
          <input type="number" min={0} className={field} value={d.priceValue || ''} onChange={(e) => vm.setField('priceValue', Number(e.target.value))} />
        </Label>
        <Label text={t('form.priceShown')}>
          <input className={field} value={d.price} onChange={(e) => vm.setField('price', e.target.value)} placeholder={t('form.priceShownPh')} />
        </Label>
        <Label text={t('form.bedrooms')}>
          <input type="number" min={0} className={field} value={d.bedrooms ?? ''} onChange={(e) => vm.setField('bedrooms', numberOrUndefined(e.target.value))} />
        </Label>
        <Label text={t('form.bathrooms')}>
          <input type="number" min={0} className={field} value={d.bathrooms ?? ''} onChange={(e) => vm.setField('bathrooms', numberOrUndefined(e.target.value))} />
        </Label>
        <Label text={t('form.description')} className="sm:col-span-2">
          <textarea rows={5} className={field} value={d.description} onChange={(e) => vm.setField('description', e.target.value)} />
        </Label>
        <label className="sm:col-span-2 flex items-center gap-2 text-sm text-fg">
          <input type="checkbox" checked={d.featured} onChange={(e) => vm.setField('featured', e.target.checked)} />
          {t('form.featured')}
        </label>
      </div>

      <h3 className="font-semibold text-fg mt-8 mb-2">{t('form.amenities')}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {d.amenities.map((a) => (
          <span key={a} className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-3 py-1 text-sm text-fg">
            {a}
            <button onClick={() => vm.removeAmenity(a)} aria-label={t('form.remove', { name: a })} className="text-ash hover:text-red-600"><X size={14} /></button>
          </span>
        ))}
        {d.amenities.length === 0 && <span className="text-ash text-sm">{t('form.none')}</span>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); addAmenity(); }} className="flex gap-2 max-w-md">
        <input className={field} value={amenity} onChange={(e) => setAmenity(e.target.value)} placeholder={t('form.amenityPh')} />
        <button type="submit" className="neopop-btn neopop-btn-outline"><Plus size={16} /> {t('form.add')}</button>
      </form>

      <h3 className="font-semibold text-fg mt-8 mb-2">{t('form.images')} <span className="text-ash font-normal text-sm">{t('form.firstCover')}</span></h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {d.images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative rounded-xl overflow-hidden bg-ink-800 aspect-[4/3]">
            <img src={src} alt="" className="w-full h-full object-cover" />
            {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-gold text-white text-xs font-semibold px-2 py-0.5">{t('form.cover')}</span>}
            <div className="absolute inset-x-2 bottom-2 flex justify-between">
              <div className="flex gap-1">
                <button className={iconBtn} disabled={i === 0} onClick={() => vm.moveImage(i, -1)} aria-label={t('form.moveEarlier')}><ArrowLeft size={14} /></button>
                <button className={iconBtn} disabled={i === d.images.length - 1} onClick={() => vm.moveImage(i, 1)} aria-label={t('form.moveLater')}><ArrowRight size={14} /></button>
                <button className={iconBtn} disabled={i === 0} onClick={() => vm.makeCover(i)} aria-label={t('form.makeCover')}><Star size={14} /></button>
              </div>
              <button className={iconBtn} onClick={() => vm.removeImage(i)} aria-label={t('form.removeImage')}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <input ref={fileRef} type="file" accept="image/*" multiple hidden
          onChange={(e) => { if (e.target.files?.length) vm.uploadImages(e.target.files); e.target.value = ''; }} />
        <button onClick={() => fileRef.current?.click()} disabled={vm.busy} className="neopop-btn neopop-btn-outline">
          <Upload size={16} /> {t('form.upload')}
        </button>
        <form onSubmit={(e) => { e.preventDefault(); vm.addImageUrl(url); setUrl(''); }} className="flex gap-2 flex-1 min-w-[260px]">
          <input className={field} value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('form.imageUrlPh')} />
          <button type="submit" className="neopop-btn neopop-btn-outline">{t('form.add')}</button>
        </form>
      </div>

    </div>
  );
}
