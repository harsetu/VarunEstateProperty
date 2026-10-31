import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { t } from '@/core/utils/i18n';

interface Props {
  images: string[];
  index: number;
  alt: string;
  onChange: (index: number) => void;
  onClose: () => void;
}

/** Full-screen photo viewer. Arrows (buttons and keys) only appear when there is more than one photo. */
export default function ImageLightbox({ images, index, alt, onChange, onClose }: Props) {
  const many = images.length > 1;
  const step = (d: number) => onChange((index + d + images.length) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (many && e.key === 'ArrowRight') onChange((index + 1) % images.length);
      else if (many && e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [index, images.length, many, onChange, onClose]);

  // Portalled so it isn't trapped by transformed ancestors (tilt/reveal) and never counts as a click on a parent link
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[8000] bg-night/95 flex items-center justify-center"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <button aria-label={t('common.close')} className="absolute top-5 right-5 text-white hover:text-gold-light" onClick={onClose}>
        <X size={32} />
      </button>
      {many && (
        <button aria-label="Previous photo" className="absolute left-3 sm:left-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); step(-1); }}>
          <ChevronLeft size={32} />
        </button>
      )}
      <img src={images[index]} alt={alt} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
      {many && (
        <button aria-label="Next photo" className="absolute right-3 sm:right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); step(1); }}>
          <ChevronRight size={32} />
        </button>
      )}
      {many && <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">{index + 1} / {images.length}</p>}
    </div>,
    document.body,
  );
}
