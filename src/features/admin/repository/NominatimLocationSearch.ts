import type { GeoPlace } from '@/features/admin/model/place';
import type { LocationSearchRepository } from '@/features/admin/repository/LocationSearchRepository';

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string; town?: string; village?: string; state_district?: string;
    state?: string; postcode?: string; country?: string;
  };
}

const round = (n: number) => Number(n.toFixed(6));

/** "28.3967, 77.3652" or a Google Maps link (…@lat,lng… / …!3dlat!4dlng… / …?q=lat,lng) -> coordinates. */
export const parseCoordinates = (text: string): { latitude: number; longitude: number } | null => {
  const m =
    text.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ??
    text.match(/@(-?\d+\.\d+),\s*(-?\d+\.\d+)/) ??
    text.match(/[?&](?:q|ll|query)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/) ??
    text.trim().match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/) ??
    text.match(/(-?\d{1,2}\.\d{3,}),[+\s]*(-?\d{1,3}\.\d{3,})/); // e.g. /maps/search/28.4,+77.3
  if (!m) return null;
  const latitude = Number(m[1]);
  const longitude = Number(m[2]);
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180 ? { latitude: round(latitude), longitude: round(longitude) } : null;
};

/**
 * OpenStreetMap Nominatim geocoding (free, no key; keep requests infrequent — see their usage policy).
 * Results are limited to places named `geo.area` inside `geo.bounds` [west, south, east, north] when given.
 */
export class NominatimLocationSearch implements LocationSearchRepository {
  constructor(private readonly geo?: { area: string; bounds: [number, number, number, number] }, private readonly countryCodes = 'in') {}

  search = async (query: string, signal?: AbortSignal): Promise<GeoPlace[]> => {
    const pasted = parseCoordinates(query);
    if (pasted) return [{ label: `${pasted.latitude}, ${pasted.longitude}`, ...pasted }];

    const qs = new URLSearchParams({
      q: query, format: 'jsonv2', addressdetails: '1', limit: '8', 'accept-language': 'en', countrycodes: this.countryCodes,
    });
    if (this.geo) {
      const [west, south, east, north] = this.geo.bounds;
      qs.set('viewbox', `${west},${north},${east},${south}`); // left, top, right, bottom
      qs.set('bounded', '1');
    }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Location search failed (${res.status})`);
    const rows = (await res.json()) as NominatimResult[];
    const seen = new Set<string>();
    return rows
      .map((r) => ({
        label: r.display_name,
        latitude: round(Number(r.lat)),
        longitude: round(Number(r.lon)),
        city: r.address?.city ?? r.address?.town ?? r.address?.village ?? r.address?.state_district,
        state: r.address?.state,
        country: r.address?.country,
        pincode: r.address?.postcode,
      }))
      // the box can clip a neighbouring city (e.g. Delhi), so keep only places in the area itself
      .filter((p) => !this.geo || p.label.toLowerCase().includes(this.geo.area.toLowerCase()))
      .filter((p) => !seen.has(p.label) && !!seen.add(p.label));
  };
}
