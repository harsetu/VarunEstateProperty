import { useState } from 'react';
import { ExternalLink, Instagram, Play } from 'lucide-react';
import { embedUrl, parseVideoUrl, thumbnailUrl } from '@/features/reviews/model/review';
import Modal from '@/core/widgets/Modal';
import { t } from '@/core/utils/i18n';

interface Props {
  url: string;
  /** Fill the parent (which must be `relative`) instead of using a 16:9 box. */
  fill?: boolean;
  className?: string;
}

/** A play tile (thumbnail where one exists). Clicking it opens the video in a dialog, so nothing loads until then. */
export default function ReviewVideo({ url, fill = false, className = '' }: Props) {
  const [open, setOpen] = useState(false);
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
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={t('reviewsHome.play')} className={`${box} group block overflow-hidden`}>
        {thumb && <img src={thumb} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
        {portrait && (
          <span className="absolute inset-0 bg-gradient-to-br from-[#833ab4]/70 via-[#fd1d1d]/60 to-[#fcb045]/70 flex items-start justify-center pt-[14%]">
            <Instagram size={36} className="text-white/90" />
          </span>
        )}
        <span className="absolute inset-0 bg-night/20 group-hover:bg-transparent transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-14 h-14 rounded-full bg-gold text-white flex items-center justify-center shadow-card-hover group-hover:scale-110 transition-transform">
            <Play size={22} className="fill-white ml-0.5" />
          </span>
        </span>
      </button>

      {/* Mounted only while open, so closing it stops playback */}
      <Modal open={open} onClose={() => setOpen(false)} title={t('reviewsHome.dialogTitle')} size="sheet">
        {src.kind === 'file' ? (
          <video controls autoPlay playsInline className="w-full max-h-[78vh] rounded-xl bg-night -mt-2">
            <source src={src.url} />
          </video>
        ) : (
          <iframe
            src={embedUrl(src, true)}
            title={t('reviewsHome.play')}
            className={`rounded-xl bg-night -mt-2 ${portrait ? 'block mx-auto w-full max-w-md h-[min(78vh,680px)]' : 'w-full aspect-video max-h-[78vh]'}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
        {portrait && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-gold font-semibold hover:underline">
            <ExternalLink size={14} /> {t('reviewsHome.watch')}
          </a>
        )}
      </Modal>
    </>
  );
}
