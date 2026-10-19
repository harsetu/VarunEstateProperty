import type { Property } from '@/features/properties/model/property';
import { t } from '@/core/utils/i18n';

const money = (v?: number) => (v == null ? undefined : `₹${v.toLocaleString('en-IN')}`);

/** Everything the backend knows about a listing beyond the headline specs; empty values are left out. */
export default function PropertyFacts({ property: p }: { property: Property }) {
  const address = [p.address, p.sector, p.city, p.state, p.pincode, p.country].filter(Boolean).join(', ');
  const rows: [string, string | undefined][] = [
    [t('detail.status'), p.status ? t(`status.${p.status}`) : undefined],
    [t('detail.furnishing'), p.furnishing ? t(`furnishing.${p.furnishing}`) : undefined],
    [t('detail.balconies'), p.balconies?.toString()],
    [t('detail.parking'), p.parkingSpots?.toString()],
    [t('detail.floor'), p.floorNumber != null ? (p.totalFloors != null ? t('detail.floorOf', { floor: p.floorNumber, total: p.totalFloors }) : String(p.floorNumber)) : p.totalFloors != null ? t('detail.totalFloors', { total: p.totalFloors }) : undefined],
    [t('detail.floorsAvailable'), p.floorAvailability === 'ALL' ? t('floorAvail.ALL')
      : p.floorAvailability === 'MULTIPLE' && p.availableFloors?.length ? t('detail.floorsList', { floors: p.availableFloors.join(', ') })
      : undefined],
    [t('detail.facing'), p.facing?.replace(/_/g, ' ')],
    [t('detail.age'), p.propertyAgeYears != null ? t('detail.ageYears', { years: p.propertyAgeYears }) : undefined],
    [t('detail.availableFrom'), p.availableFrom ? new Date(`${p.availableFrom}T00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined],
    [t('detail.deposit'), money(p.securityDeposit)],
    [t('detail.maintenance'), money(p.maintenanceCharge)],
    [t('detail.address'), address || undefined],
  ];
  const shown = rows.filter(([, v]) => v);
  const hasAny = shown.length > 0 || p.usps?.length || p.tags?.length || p.paperwork;
  if (!hasAny) return null;

  return (
    <div className="mb-12">
      <h2 className="font-display font-bold text-fg text-2xl tracking-tight mb-4">{t('detail.moreDetails')}</h2>
      {shown.length > 0 && (
        <dl className="grid sm:grid-cols-2 gap-x-8 rounded-2xl bg-white border border-fg/10 px-6 py-2 mb-6">
          {shown.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3 border-b border-fg/8 last:border-0 text-sm">
              <dt className="text-ash-dark">{label}</dt>
              <dd className="text-fg font-medium text-right">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {p.usps && p.usps.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-fg mb-2">{t('detail.highlights')}</h3>
          <div className="flex flex-wrap gap-2">
            {p.usps.map((u) => <span key={u} className="rounded-full bg-gold/10 text-fg text-sm font-medium px-3 py-1">{u}</span>)}
          </div>
        </div>
      )}
      {p.paperwork && (
        <div className="mb-6">
          <h3 className="font-semibold text-fg mb-2">{t('detail.paperwork')}</h3>
          <p className="text-ash leading-relaxed whitespace-pre-line">{p.paperwork}</p>
        </div>
      )}
      {p.tags && p.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {p.tags.map((tag) => <span key={tag} className="rounded-full border border-fg/15 text-ash text-xs px-3 py-1">#{tag}</span>)}
        </div>
      )}
    </div>
  );
}
