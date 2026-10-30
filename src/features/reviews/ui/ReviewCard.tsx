import { useState } from 'react';
import { Quote } from 'lucide-react';
import { formatReviewDate, type Review } from '@/features/reviews/model/review';
import ReviewVideo from '@/features/reviews/ui/ReviewVideo';
import { t } from '@/core/utils/i18n';

const LONG_TEXT = 220;

/** Every card is the same size: text is clamped (with "Read more"), videos fill a fixed-height frame. */
export default function ReviewCard({ review }: { review: Review }) {
  const [open, setOpen] = useState(false);
  const date = formatReviewDate(review.createdAt);

  if (review.type === 'VIDEO' && review.videoUrl) {
    return (
      <figure className="h-full min-h-[340px] flex flex-col rounded-2xl bg-white shadow-card overflow-hidden">
        <div className="relative flex-1 min-h-[260px]">
          <ReviewVideo url={review.videoUrl} fill />
        </div>
        {date && <figcaption className="px-5 py-3 text-ash text-sm">{date}</figcaption>}
      </figure>
    );
  }

  const text = review.text ?? '';
  const long = text.length > LONG_TEXT;
  return (
    <figure className="h-full min-h-[340px] flex flex-col rounded-2xl bg-white shadow-card p-7">
      <Quote size={28} className="text-gold/25 mb-4 shrink-0" />
      <div className="flex-1">
        <blockquote className={`text-fg/85 leading-relaxed whitespace-pre-line break-words ${open ? '' : 'line-clamp-6'}`}>“{text}”</blockquote>
        {long && (
          <button onClick={() => setOpen((o) => !o)} className="mt-2 text-sm font-semibold text-gold hover:underline">
            {open ? t('reviewsHome.less') : t('reviewsHome.more')}
          </button>
        )}
      </div>
      {date && <figcaption className="mt-6 pt-5 border-t border-fg/10 text-ash text-sm shrink-0">{date}</figcaption>}
    </figure>
  );
}
