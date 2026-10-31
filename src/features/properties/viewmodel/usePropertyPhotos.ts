import { useEffect, useRef, useState } from 'react';
import { propertyRepository } from '@/app/container';

// The listing endpoint carries only the cover photo, so the rest come from the detail call, once per property
const cache = new Map<string, Promise<string[]>>();
const photosOf = (id: string, fallback: string[]) => {
  let hit = cache.get(id);
  if (!hit) {
    hit = propertyRepository.getById(id).then((p) => (p && p.images.length ? p.images : fallback)).catch(() => fallback);
    cache.set(id, hit);
  }
  return hit;
};

/**
 * The photos to cycle through. Starts with `initial` (usually just the cover) and, when the element
 * scrolls into view, swaps in the full set. Pass `enabled: false` to skip the fetch.
 */
export function usePropertyPhotos<T extends HTMLElement>(id: string, initial: string[], enabled = true) {
  const ref = useRef<T>(null);
  const [photos, setPhotos] = useState(initial);

  useEffect(() => setPhotos(initial), [id, initial.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || initial.length !== 1) return;
    let alive = true;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      photosOf(id, initial).then((all) => alive && setPhotos(all));
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => { alive = false; io.disconnect(); };
  }, [id, enabled, initial.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ref, photos };
}
