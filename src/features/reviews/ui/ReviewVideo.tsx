import { useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { embedUrl, parseVideoUrl, thumbnailUrl } from '@/features/reviews/model/review';
import { t } from '@/core/utils/i18n';

interface Props {
  url: string;
  /** Fill the parent (which must be `relative`) instead of using a 16:9 box. */
  fill?: boolean;
  className?: string;
}

/** A play tile (thumbnail where one exists). Clicking it plays the video inside the same frame, with no popup. Instagram embeds sit in the frame straight away. */
export default function ReviewVideo({ url, fill = false, className = '' }: Props) {
  const [playing, setPlaying] = useState(false);
  const src = parseVideoUrl(url);
  const box = `${fill ? 'absolute inset-0 h-full' : 'aspect-video'} w-full bg-night ${className}`;

  if (src.kind === 'link') {
    return (
      <a
        href={src.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${box} flex items-center justify-center gap-2 text-white text-sm font-semibold hover:text-gold-light`}
      >
        <ExternalLink size={16} /> {t('reviewsHome.watch')}
      </a>
    );
  }

  const thumb = thumbnailUrl(src);
  const portrait = src.kind === 'instagram';

  // Plays right here: the iframe / video takes the place of the tile, in the same box
  if (playing || portrait) {
    return (
      <div className={`${box} overflow-hidden`}>
        {src.kind === 'file' ? (
          <video controls autoPlay playsInline className="absolute inset-0 w-full h-full object-contain bg-night">
            <source src={src.url} />
          </video>
        ) : (
          <iframe
            src={embedUrl(src, true)}
            title={t('reviewsHome.play')}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0 bg-night"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={t('reviewsHome.play')} className={`${box} group block overflow-hidden`}>
      {thumb && <img src={thumb} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
      <span className="absolute inset-0 bg-night/20 group-hover:bg-transparent transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-14 h-14 rounded-full bg-gold text-white flex items-center justify-center shadow-card-hover group-hover:scale-110 transition-transform">
          <Play size={22} className="fill-white ml-0.5" />
        </span>
      </span>
    </button>
  );
}
