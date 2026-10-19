import { useRef, useState, type ReactNode } from 'react';
import LocationPicker from '@/features/admin/ui/LocationPicker';
import ConfirmDialog from '@/core/widgets/ConfirmDialog';
import { ArrowLeft, ArrowRight, Plus, Star, Trash2, Upload, X } from 'lucide-react';
import { FLOOR_AVAILABILITY, FURNISHINGS, LABELS, LISTING_STATUSES, type FloorAvailability, type Furnishing, type Label as ListingLabel, type ListingStatus, type Property, type PropertyType, type Purpose } from '@/features/properties/model/property';
import { effectiveAvailability, fieldRules } from '@/features/admin/model/formRules';
import flavor from '@/flavors';
import { formatINR } from '@/core/utils/pricing';
import type { usePropertyEditorViewModel } from '@/features/admin/viewmodel/usePropertyEditorViewModel';
import { t } from '@/core/utils/i18n';

type VM = ReturnType<typeof usePropertyEditorViewModel>;

const field = 'w-full rounded-xl border border-fg/15 bg-white px-4 py-2.5 text-fg focus:outline-none focus:border-gold';
const iconBtn = 'p-1.5 rounded-lg bg-white/90 text-fg hover:text-gold disabled:opacity-40 shadow-card';

const caption = 'block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1';

const Label = ({ text, children, className = '', required, hint }: { text: string; children: ReactNode; className?: string; required?: boolean; hint?: string }) => (
  <label className={`block ${className}`}>
    <span className={caption}>{text}{required && <span className="text-red-500"> *</span>}</span>
    {children}
    {hint && <span className="block text-xs text-ash mt-1">{hint}</span>}
  </label>
);

/** Radio-style segmented buttons for a short list of exclusive options. */
function Choice<T extends string>({ label, value, options, onChange, allowClear, className = '' }: {
  label: string; value: T | undefined; options: { value: T; label: string }[];
  onChange: (v: T | undefined) => void; allowClear?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <span className={caption}>{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(on && allowClear ? undefined : o.value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                on ? 'bg-fg text-white border-fg' : 'bg-white text-ash border-fg/15 hover:text-fg hover:border-fg/40'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const Section = ({ title }: { title: string }) => <h3 className="font-semibold text-fg mt-8 mb-3 sm:col-span-2">{title}</h3>;

function ChipInput({ label, placeholder, values, onChange }: { label: string; placeholder: string; values: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState('');
  const add = () => { const v = text.trim(); if (v && !values.includes(v)) onChange([...values, v]); setText(''); };
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-fg mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {values.map((a) => (
          <span key={a} className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-3 py-1 text-sm text-fg">
            {a}
            <button onClick={() => onChange(values.filter((x) => x !== a))} aria-label={t('form.remove', { name: a })} className="text-ash hover:text-red-600"><X size={14} /></button>
          </span>
        ))}
        {values.length === 0 && <span className="text-ash text-sm">{t('form.none')}</span>}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); add(); }} className="flex gap-2 max-w-md">
        <input className={field} value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
        <button type="submit" className="neopop-btn neopop-btn-outline"><Plus size={16} /> {t('form.add')}</button>
      </form>
    </div>
  );
}

const numberOrUndefined = (v: string) => (v === '' ? undefined : Number(v));

export default function PropertyForm({ vm }: { vm: VM }) {
  const { draft: d } = vm;
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [amenity, setAmenity] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  if (!d) return <p className="text-ash">Loading…</p>;

  const rules = fieldRules(d.type, d.purpose);
  const availability = effectiveAvailability(d);

  const num = (key: 'bedrooms' | 'bathrooms' | 'securityDeposit' | 'maintenanceCharge' | 'balconies' | 'parkingSpots' | 'floorNumber' | 'totalFloors' | 'propertyAgeYears', text: string, step?: string) => (
    <Label text={text}>
      <input type="number" step={step} className={field} value={d[key] ?? ''} onChange={(e) => vm.setField(key, numberOrUndefined(e.target.value) as Property[typeof key])} />
    </Label>
  );
  const str = (key: 'info' | 'address' | 'city' | 'state' | 'country' | 'pincode' | 'facing', text: string, placeholder?: string, className?: string, maxLength?: number) => (
    <Label text={text} className={className}>
      <input className={field} maxLength={maxLength} value={d[key] ?? ''} placeholder={placeholder} onChange={(e) => vm.setField(key, e.target.value)} />
    </Label>
  );
  const toggleLabel = (l: ListingLabel) => {
    const cur = d.labels ?? [];
    vm.setField('labels', cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]);
    if (l === 'FEATURED') vm.setField('featured', !cur.includes(l));
  };

  const actions = (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => (vm.isNew ? vm.remove() : setConfirmDelete(true))}
        disabled={vm.busy}
        className="neopop-btn neopop-btn-outline !text-red-600 disabled:opacity-50"
      >
        <Trash2 size={16} /> {vm.isNew ? t('form.discard') : t('form.delete')}
      </button>
      <button onClick={vm.save} disabled={!vm.dirty || vm.busy} className="neopop-btn disabled:opacity-50">
        {vm.busy ? t('form.working') : t('form.save')}
      </button>
    </div>
  );

  const addAmenity = () => { vm.addAmenity(amenity); setAmenity(''); };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-display font-semibold text-fg text-xl">{vm.isNew ? t('form.newListing') : t('form.editListing')}</h2>
        {!vm.isNew && (
          <button
            onClick={() => (vm.dirty ? setConfirmClose(true) : vm.close())}
            disabled={vm.busy}
            aria-label={t('form.close')}
            title={t('form.close')}
            className="-mr-2 p-1.5 rounded-full text-ash hover:text-fg hover:bg-ink-800 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        )}
      </div>
      <div className="flex justify-end mb-5">{actions}</div>

      {vm.message && (
        <p role="status" className={`text-sm mb-4 ${vm.message.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
          {vm.message.text}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Label text={t('form.title')} required className="sm:col-span-2">
          <input className={field} value={d.title} onChange={(e) => vm.setField('title', e.target.value)} placeholder={t('form.titlePh')} />
        </Label>
        <Choice
          label={t('form.for')}
          value={d.purpose}
          options={[{ value: 'Sale' as Purpose, label: t('form.sale') }, { value: 'Rent' as Purpose, label: t('form.rent') }]}
          onChange={(v) => v && vm.setField('purpose', v)}
        />
        <Choice
          label={t('form.type')}
          value={d.type}
          options={vm.types.map((o) => ({ value: o as PropertyType, label: o }))}
          onChange={(v) => v && vm.setField('type', v)}
        />
        <Choice
          label={t('form.status')}
          className="sm:col-span-2"
          value={d.status ?? 'ACTIVE'}
          options={LISTING_STATUSES.map((o) => ({ value: o as ListingStatus, label: t(`status.${o}`) }))}
          onChange={(v) => v && vm.setField('status', v)}
        />
        {str('info', t('form.info'), t('form.infoPh'), 'sm:col-span-2', 500)}

        <Section title={t('form.secLocation')} />
        <Label text={t('form.sector')} required>
          <input className={field} list="sector-options" value={d.sector} onChange={(e) => vm.setField('sector', e.target.value)} />
          <datalist id="sector-options">{vm.sectors.map((s) => <option key={s} value={s} />)}</datalist>
        </Label>
        {str('city', t('form.city'), flavor.market)}
        {str('address', t('form.address'), undefined, 'sm:col-span-2', 500)}
        {str('state', t('form.state'))}
        {str('country', t('form.country'))}
        {str('pincode', t('form.pincode'), undefined, undefined, 15)}
        <LocationPicker
          latitude={d.latitude}
          longitude={d.longitude}
          onPick={(p) => vm.pickLocation(p)}
          onClear={() => vm.clearLocation()}
        />

        <Section title={t('form.secPricing')} />
        <Label
          text={d.purpose === 'Rent' ? t('form.rentPrice') : t('form.salePrice')}
          required
          hint={d.priceValue > 0 ? t('form.priceShownAs', { price: formatINR(d.priceValue) }) : undefined}
        >
          <input type="number" min={0} className={field} value={d.priceValue || ''} onChange={(e) => vm.setField('priceValue', Number(e.target.value))} />
        </Label>
        {rules.deposit && num('securityDeposit', t('form.deposit'))}
        {rules.maintenance && num('maintenanceCharge', t('form.maintenance'))}
        <div className="sm:col-span-2 flex flex-wrap gap-x-6 gap-y-2">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={Boolean(d.priceNegotiable)} onChange={(e) => vm.setField('priceNegotiable', e.target.checked)} />
            {t('form.negotiable')}
          </label>
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={Boolean(d.hidePrice)} onChange={(e) => vm.setField('hidePrice', e.target.checked)} />
            {t('form.hidePrice')}
          </label>
        </div>

        <Section title={t('form.secDetails')} />
        <Label text={t('form.size')}>
          <input className={field} value={d.area} onChange={(e) => vm.setField('area', e.target.value)} placeholder={t('form.sizePh')} />
        </Label>
        {rules.bedrooms && num('bedrooms', t('form.bedrooms'))}
        {rules.bathrooms && num('bathrooms', d.type === 'Commercial' ? t('form.washrooms') : t('form.bathrooms'))}
        {rules.balconies && num('balconies', t('form.balconies'))}
        {rules.parking && num('parkingSpots', t('form.parking'))}
        {rules.floors && (
          <>
            <Choice
              label={t('form.floorAvail')}
              className="sm:col-span-2"
              value={availability}
              options={FLOOR_AVAILABILITY.map((o) => ({ value: o as FloorAvailability, label: t(`floorAvail.${o}`) }))}
              onChange={(v) => v && vm.setField('floorAvailability', v)}
            />
            {availability === 'SINGLE' && num('floorNumber', t('form.floor'))}
            {availability === 'MULTIPLE' && (
              <Label text={t('form.floorList')}>
                <input
                  className={field}
                  defaultValue={(d.availableFloors ?? []).join(', ')}
                  placeholder={t('form.floorListPh')}
                  onChange={(e) => vm.setField('availableFloors', e.target.value.split(/[\s,]+/).filter(Boolean).map(Number).filter((n) => Number.isInteger(n)))}
                />
              </Label>
            )}
            {num('totalFloors', t('form.totalFloors'))}
          </>
        )}
        {rules.furnishing && (
          <Choice
            label={t('form.furnishing')}
            className="sm:col-span-2"
            value={d.furnishing}
            allowClear
            options={FURNISHINGS.map((o) => ({ value: o as Furnishing, label: t(`furnishing.${o}`) }))}
            onChange={(v) => vm.setField('furnishing', v)}
          />
        )}
        {str('facing', t('form.facing'), t('form.facingPh'))}
        {rules.age && num('propertyAgeYears', t('form.age'))}
        <Label text={t('form.availableFrom')}>
          <input type="date" className={field} value={d.availableFrom ?? ''} onChange={(e) => vm.setField('availableFrom', e.target.value || undefined)} />
        </Label>
        <Label text={t('form.description')} className="sm:col-span-2">
          <textarea rows={5} className={field} value={d.description} onChange={(e) => vm.setField('description', e.target.value)} />
        </Label>
        <Label text={t('form.paperwork')} className="sm:col-span-2">
          <textarea rows={2} className={field} value={d.paperwork ?? ''} placeholder={t('form.paperworkPh')} onChange={(e) => vm.setField('paperwork', e.target.value)} />
        </Label>

        <Section title={t('form.secHighlights')} />
        <div className="sm:col-span-2 flex flex-wrap gap-x-5 gap-y-2">
          {LABELS.map((l) => (
            <label key={l} className="flex items-center gap-2 text-sm text-fg">
              <input type="checkbox" checked={(d.labels ?? []).includes(l)} onChange={() => toggleLabel(l)} />
              {t(`label.${l}`)}
            </label>
          ))}
        </div>
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

      <ChipInput label={t('form.usps')} placeholder={t('form.uspPh')} values={d.usps ?? []} onChange={(v) => vm.setField('usps', v)} />
      <ChipInput label={t('form.tags')} placeholder={t('form.tagPh')} values={d.tags ?? []} onChange={(v) => vm.setField('tags', v)} />

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


      <div className="mt-10 pt-6 border-t border-fg/10 flex flex-wrap items-center justify-between gap-3">
        {vm.message ? (
          <p role="status" className={`text-sm ${vm.message.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>{vm.message.text}</p>
        ) : <span />}
        {actions}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={t('confirm.deleteTitle')}
        message={t('confirm.deleteBody', { title: d.title })}
        confirmLabel={vm.busy ? t('confirm.deleting') : t('confirm.delete')}
        busy={vm.busy}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => { await vm.remove(); setConfirmDelete(false); }}
      />

      <ConfirmDialog
        open={confirmClose}
        title={t('confirm.discardTitle')}
        message={t('confirm.discardBody')}
        confirmLabel={t('confirm.discard')}
        onCancel={() => setConfirmClose(false)}
        onConfirm={() => { setConfirmClose(false); vm.close(); }}
      />
    </div>
  );
}
