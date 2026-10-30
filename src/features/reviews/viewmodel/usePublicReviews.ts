import { useEffect, useState } from 'react';
import { reviewRepository } from '@/app/container';
import type { Review } from '@/features/reviews/model/review';

/** Public reviews for the website. A failed request just yields an empty list, so the section hides. */
export function usePublicReviews() {
  const [state, setState] = useState<{ loading: boolean; items: Review[] }>({ loading: !!reviewRepository, items: [] });

  useEffect(() => {
    if (!reviewRepository) return;
    let cancelled = false;
    reviewRepository
      .listPublic()
      .then((items) => !cancelled && setState({ loading: false, items }))
      .catch(() => !cancelled && setState({ loading: false, items: [] }));
    return () => { cancelled = true; };
  }, []);

  return state;
}
