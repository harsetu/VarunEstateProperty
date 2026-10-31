import { t } from '@/core/utils/i18n';

// Photos are a mix of portrait and landscape, so every one sits in the same landscape frame:
// the full picture is shown (no cropping) over a blurred copy of itself that fills the frame.
export default function AwardFrame({ src, n, onOpen, className = '' }: { src: string; n: number; onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t('awards.alt', { n })}
      className={`group relative shrink-0 aspect-[4/3] overflow-hidden rounded-2xl bg-ink-700 shadow-card hover:shadow-card-hover transition-shadow cursor-zoom-in ${className}`}
    >
      <img src={src} alt="" aria-hidden loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60" />
      <img src={src} alt={t('awards.alt', { n })} loading="lazy" className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
    </button>
  );
}
