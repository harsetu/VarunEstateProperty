import { useState } from 'react';
import PinMap from '@/features/admin/ui/PinMap';
import { Link2, Loader2, MapPin, Search, X } from 'lucide-react';
import type { GeoPlace } from '@/features/admin/model/place';
import { parseCoordinates } from '@/features/admin/repository/NominatimLocationSearch';
import { useLocationSearch } from '@/features/admin/viewmodel/useLocationSearch';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';

const field = 'w-full rounded-xl border border-fg/15 bg-white pl-9 pr-4 py-2.5 text-fg focus:outline-none focus:border-gold';

interface Props {
  latitude?: number;
  longitude?: number;
  onPick: (place: GeoPlace) => void;
  onClear: () => void;
}

/** Search for an area, society or landmark; picking a result fills the coordinates (and blank address parts). */
export default function LocationPicker({ latitude, longitude, onPick, onClear }: Props) {
  const s = useLocationSearch();
  const [open, setOpen] = useState(false);
  const hasPoint = latitude != null && longitude != null;

  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState(false);

  const pick = (p: GeoPlace) => { onPick(p); s.reset(); setOpen(false); };

  const applyLink = () => {
    const point = parseCoordinates(link);
    if (!point) return setLinkError(true);
    setLinkError(false);
    setLink('');
    pick({ label: `${point.latitude}, ${point.longitude}`, ...point });
  };

  return (
    <div className="sm:col-span-2">
      <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('form.locationSearch')}</span>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
        <input
          className={field}
          value={s.query}
          placeholder={t('form.locationSearchPh', { market: flavor.market })}
          onFocus={() => setOpen(true)}
          onChange={(e) => { s.setQuery(e.target.value); setOpen(true); }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          autoComplete="off"
        />
        {s.loading && <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash animate-spin" />}

        {open && s.query.trim().length >= 3 && (
          <ul className="absolute z-20 mt-1 w-full max-h-72 overflow-auto rounded-xl bg-white shadow-card-hover border border-fg/10">
            {s.error && <li className="px-4 py-3 text-sm text-red-600">{s.error}</li>}
            {!s.error && s.searched && s.results.length === 0 && !s.loading && <li className="px-4 py-3 text-sm text-ash">{t('form.locationNone')}</li>}
            {s.results.map((p) => (
              <li key={`${p.latitude},${p.longitude},${p.label}`}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(p)} className="w-full flex items-start gap-2 px-4 py-2.5 text-left text-sm text-fg hover:bg-ink-800">
                  <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                  <span>{p.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3">
        <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('form.mapLink')}</span>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
            <input
              className={field}
              value={link}
              placeholder={t('form.mapLinkPh')}
              onChange={(e) => { setLink(e.target.value); setLinkError(false); }}
              onPaste={(e) => {
                // apply straight away when a link is pasted
                const text = e.clipboardData.getData('text');
                const point = parseCoordinates(text);
                if (point) { e.preventDefault(); setLink(''); pick({ label: `${point.latitude}, ${point.longitude}`, ...point }); }
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } }}
            />
          </div>
          <button type="button" onClick={applyLink} disabled={!link.trim()} className="neopop-btn neopop-btn-outline disabled:opacity-50">{t('form.mapLinkUse')}</button>
        </div>
        {linkError && <p role="alert" className="text-xs text-red-600 mt-1">{t('form.mapLinkBad')}</p>}
      </div>

      <div className="mt-3">
        <PinMap latitude={latitude} longitude={longitude} onChange={(lat, lng) => onPick({ label: `${lat}, ${lng}`, latitude: lat, longitude: lng })} />
        {hasPoint && (
          <div className="flex items-center justify-between gap-3 px-1 pt-1 text-xs text-ash">
            <span>{t('form.locationSet', { lat: latitude!.toFixed(5), lng: longitude!.toFixed(5) })}</span>
            <button type="button" onClick={onClear} className="flex items-center gap-1 text-red-600 font-semibold"><X size={13} /> {t('form.locationClear')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
