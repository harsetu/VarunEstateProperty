import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import flavor from '@/flavors';
import { t } from '@/core/utils/i18n';

interface Props {
  latitude?: number;
  longitude?: number;
  onChange: (latitude: number, longitude: number) => void;
}

const PIN = L.divIcon({
  className: '',
  html: '<span style="display:block;width:22px;height:22px;border-radius:50% 50% 50% 0;background:#b8862b;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);transform:rotate(-45deg)"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

const round = (n: number) => Number(n.toFixed(6));

/** Interactive map: click anywhere (or drag the pin) to set the location. Follows the coordinates when they change from outside. */
export default function PinMap({ latitude, longitude, onChange }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const fromMap = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Create the map once
  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);

    const b = flavor.geo?.bounds;
    if (b) m.fitBounds([[b[1], b[0]], [b[3], b[2]]]);
    else m.setView([20.59, 78.96], 5);

    const place = (lat: number, lng: number) => {
      fromMap.current = true;
      onChangeRef.current(round(lat), round(lng));
    };
    m.on('click', (e: L.LeafletMouseEvent) => place(e.latlng.lat, e.latlng.lng));
    map.current = m;
    // the container may be laid out after mount
    setTimeout(() => m.invalidateSize(), 0);
    return () => { m.remove(); map.current = null; marker.current = null; };
  }, []);

  // Keep the pin in step with the coordinates
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (latitude == null || longitude == null) {
      marker.current?.remove();
      marker.current = null;
      return;
    }
    const pos: L.LatLngExpression = [latitude, longitude];
    if (!marker.current) {
      marker.current = L.marker(pos, { icon: PIN, draggable: true }).addTo(m);
      marker.current.on('dragend', () => {
        const p = marker.current!.getLatLng();
        fromMap.current = true;
        onChangeRef.current(round(p.lat), round(p.lng));
      });
    } else {
      marker.current.setLatLng(pos);
    }
    // a click/drag already shows where the pin is; search results and pasted links need the view to move
    if (fromMap.current) fromMap.current = false;
    else m.setView(pos, Math.max(m.getZoom(), 16));
  }, [latitude, longitude]);

  return (
    <div>
      <div ref={el} className="w-full h-64 rounded-xl overflow-hidden border border-fg/10 z-0" role="application" aria-label={t('form.mapAria')} />
      <p className="text-xs text-ash mt-1">{t('form.mapTap')}</p>
    </div>
  );
}
