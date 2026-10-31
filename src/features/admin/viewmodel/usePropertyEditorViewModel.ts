import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property, PropertyType, Purpose } from '@/features/properties/model/property';
import { effectiveAvailability, fieldRules, sanitize } from '@/features/admin/model/formRules';
import type { GeoPlace } from '@/features/admin/model/place';
import { formatPriceRange } from '@/core/utils/pricing';
import { HttpError } from '@/core/network/tokens';
import { buildMapEmbedUrl } from '@/core/utils/contactLinks';
import { listingAdmin, propertyRepository } from '@/app/container';
import flavor from '@/flavors';
import { useCatalog } from '@/features/properties/viewmodel/CatalogProvider';
import { t } from '@/core/utils/i18n';
import { AnalyticsEvent } from '@/constants/analytics';
import { analytics } from '@/core/analytics/analytics';

type Message = { kind: 'ok' | 'error'; text: string };

const blankProperty = (): Property => ({
  id: `p-${Date.now().toString(36)}`,
  title: '',
  type: (flavor.content.types[1] ?? 'Plot') as PropertyType,
  purpose: 'Sale' as Purpose,
  sector: '',
  price: '',
  priceValue: 0,
  area: '',
  description: '',
  images: [],
  amenities: [],
  featured: false,
  mapEmbed: '',
  status: 'ACTIVE',
  usps: [],
  tags: [],
  labels: [],
});

/** Set when a max price is entered below the min price. */
export const priceMaxError = (p: Property) => p.priceMax != null && p.priceMax < p.priceValue;

const shownPrice = (p: Property) => (p.priceValue > 0 ? formatPriceRange(p.priceValue, p.priceMax) : '');

const validate = (p: Property) => {
  if (!p.title.trim()) return t('form.errTitle');
  if (!p.sector.trim()) return t('form.errSector');
  // if (!(p.priceValue > 0)) return t('form.errPrice');
  if (priceMaxError(p)) return t('form.errPriceMax');
  if (fieldRules(p.type, p.purpose).floors && effectiveAvailability(p) === 'MULTIPLE' && !p.availableFloors?.length) return t('form.errFloors');
  if (p.images.length === 0) return t('form.errImages');
  return null;
};

/** Publish a new listing (no id) or edit/delete an existing one, including images and details. */
export function usePropertyEditorViewModel(routeId?: string) {
  const { reload, sectors } = useCatalog();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Property | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  // the server's INVALID_PRICE_RANGE, shown under the max price until it is edited
  const [serverPriceError, setServerPriceError] = useState(false);

  // Edit loads the full record (the catalog only has list summaries)
  const [original, setOriginal] = useState<Property | undefined>();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(routeId ? 'loading' : 'ready');
  const isNew = !routeId;
  const notFound = Boolean(routeId) && status === 'ready' && !original;

  useEffect(() => {
    if (!routeId) return setOriginal(undefined);
    let cancelled = false;
    setStatus('loading');
    propertyRepository.getById(routeId)
      .then((p) => { if (!cancelled) { setOriginal(p); setStatus('ready'); } })
      .catch((e: unknown) => {
        if (cancelled) return;
        setStatus('error');
        setMessage({ kind: 'error', text: e instanceof Error ? e.message : t('form.loadFailed') });
      });
    return () => { cancelled = true; };
  }, [routeId]);

  useEffect(() => {
    if (isNew) setDraft((d) => d ?? blankProperty());
    else setDraft(original ? structuredClone(original) : null);
  }, [isNew, original]);

  const dirty = draft !== null && (isNew || JSON.stringify(draft) !== JSON.stringify(original));

  const run = async (action: () => Promise<void>, okText?: string) => {
    setBusy(true);
    setMessage(null);
    setServerPriceError(false);
    try {
      await action();
      if (okText) setMessage({ kind: 'ok', text: okText });
    } catch (e) {
      if (e instanceof HttpError && e.code === 'INVALID_PRICE_RANGE') setServerPriceError(true);
      setMessage({ kind: 'error', text: e instanceof Error ? e.message : t('error.generic') });
    } finally {
      setBusy(false);
    }
  };

  const setField = <K extends keyof Property>(key: K, value: Property[K]) =>
    setDraft((d) => {
      if (!d) return d;
      if (key === 'priceValue' || key === 'priceMax') setServerPriceError(false);
      const next = { ...d, [key]: value };
      // Keep the display price in step with the number unless it was typed by hand
      if ((key === 'priceValue' || key === 'priceMax') && (!d.price || d.price === shownPrice(d))) {
        next.price = shownPrice(next);
      }
      return next;
    });

  // Picking a place sets the coordinates and fills address parts that are still blank
  const pickLocation = (p: GeoPlace) =>
    setDraft((d) => d && {
      ...d,
      latitude: p.latitude,
      longitude: p.longitude,
      city: d.city || p.city,
      state: d.state || p.state,
      country: d.country || p.country,
      pincode: d.pincode || p.pincode,
    });
  const clearLocation = () => setDraft((d) => d && { ...d, latitude: undefined, longitude: undefined });

  const setImages = (fn: (list: string[]) => string[]) => setDraft((d) => (d ? { ...d, images: fn(d.images) } : d));
  const addImageUrl = (url: string) => url.trim() && setImages((l) => [...l, url.trim()]);
  const removeImage = (i: number) => setImages((l) => l.filter((_, n) => n !== i));
  const moveImage = (i: number, by: -1 | 1) =>
    setImages((l) => {
      const j = i + by;
      if (j < 0 || j >= l.length) return l;
      const next = [...l];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const makeCover = (i: number) => setImages((l) => [l[i], ...l.filter((_, n) => n !== i)]);

  const addAmenity = (text: string) => {
    const a = text.trim();
    if (a && draft && !draft.amenities.includes(a)) setField('amenities', [...draft.amenities, a]);
  };
  const removeAmenity = (a: string) => draft && setField('amenities', draft.amenities.filter((x) => x !== a));

  const uploadImages = (files: FileList | File[]) =>
    run(async () => {
      const admin = listingAdmin;
      if (!draft || !admin) return;
      const urls = await Promise.all([...files].map((f) => admin.uploadImage(f)));
      setImages((l) => [...l, ...urls]);
    }, t('form.uploaded'));

  const save = () => {
    const admin = listingAdmin;
    if (!draft || !admin) return;
    const problem = validate(draft);
    if (problem) return setMessage({ kind: 'error', text: problem });
    const final: Property = {
      ...sanitize(draft),
      title: draft.title.trim(),
      sector: draft.sector.trim(),
      price: draft.price.trim() || shownPrice(draft),
      mapEmbed: draft.mapEmbed.trim() || buildMapEmbedUrl(`${draft.title}, ${draft.sector}, ${flavor.market}`),
      videoUrl: draft.videoUrl?.trim() || undefined,
    };
    return run(async () => {
      await (isNew ? admin.createProperty(final) : admin.updateProperty(final));
      analytics.track(AnalyticsEvent.adminPublish, { isNew });
      reload();
      navigate('/admin/listings');
    }, t('form.saved'));
  };

  const close = () => navigate('/admin/listings');

  const remove = async () => {
    const admin = listingAdmin;
    if (!draft || !admin) return;
    if (isNew) return navigate('/admin/listings');
    await run(async () => {
      await admin.deleteProperty(draft.id);
      analytics.track(AnalyticsEvent.adminDelete);
      reload();
      navigate('/admin/listings');
    });
  };

  return {
    status, notFound, draft, isNew, dirty, busy, message,
    priceMaxError: draft && (priceMaxError(draft) || serverPriceError) ? t('form.errPriceMax') : undefined,
    setField, pickLocation, clearLocation, addImageUrl, removeImage, moveImage, makeCover, uploadImages,
    addAmenity, removeAmenity, save, remove, close, canEdit: Boolean(listingAdmin),
    types: flavor.content.types.filter((t) => t !== 'All'),
    sectors,
  };
}
