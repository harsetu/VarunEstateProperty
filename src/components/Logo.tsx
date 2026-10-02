import { useId } from 'react';

interface LogoProps {
  /** 'dark' = for light backgrounds, 'light' = for dark backgrounds */
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BRAND_YELLOW = '#F2B01E';
const BRAND_INK = '#2B2B2B';

const SIZES = {
  sm: { mark: 30, name: 'text-[0.95rem]', tag: 'text-[0.5rem]' },
  md: { mark: 38, name: 'text-[1.15rem]', tag: 'text-[0.5625rem]' },
  lg: { mark: 64, name: 'text-3xl', tag: 'text-sm' },
};

// The "P" from the visiting card: upper bowl in ink, lower half a yellow
// house under a roof line, with a four-pane window.
export function LogoMark({ size = 38, tone = 'dark', className = '' }: { size?: number; tone?: 'dark' | 'light'; className?: string }) {
  const id = useId().replace(/:/g, '');
  const ink = tone === 'light' ? '#FFFFFF' : BRAND_INK;
  return (
    <svg width={size} height={(size * 56) / 48} viewBox="0 0 48 56" className={className} aria-hidden>
      <defs>
        <path id={`${id}p`} d="M9 4h19.5C37.6 4 44 10.4 44 19.5S37.6 35 28.5 35H21v15.5a3.5 3.5 0 0 1-3.5 3.5h-5A3.5 3.5 0 0 1 9 50.5V4Z" />
        <clipPath id={`${id}a`}><polygon points="0,0 48,0 48,26.5 26,12 0,26.5" /></clipPath>
        <clipPath id={`${id}b`}><polygon points="0,26.5 26,12 48,26.5 48,56 0,56" /></clipPath>
      </defs>
      <use href={`#${id}p`} fill={BRAND_YELLOW} clipPath={`url(#${id}b)`} />
      <use href={`#${id}p`} fill={ink} clipPath={`url(#${id}a)`} />
      <polyline points="4,28 26,13.2 47,28" fill="none" stroke={ink} strokeWidth="2.6" />
      <polyline points="6.5,30.8 26,17.6 45,30.8" fill="none" stroke={BRAND_YELLOW} strokeWidth="1.6" />
      <g fill="#fff">
        <rect x="22.4" y="24.4" width="3" height="3" rx="0.4" />
        <rect x="26.2" y="24.4" width="3" height="3" rx="0.4" />
        <rect x="22.4" y="28.2" width="3" height="3" rx="0.4" />
        <rect x="26.2" y="28.2" width="3" height="3" rx="0.4" />
      </g>
    </svg>
  );
}

export default function Logo({ tone = 'dark', size = 'md', showTagline = true, className = '' }: LogoProps) {
  const s = SIZES[size];
  const light = tone === 'light';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={s.mark} tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={`font-brand font-bold tracking-[0.02em] whitespace-nowrap ${s.name} ${light ? 'text-white' : 'text-[#2B2B2B]'}`}>
          PAHWA REAL ESTATE
        </span>
        {showTagline && (
          <span className={`flex items-center gap-1.5 mt-1.5 ${s.tag} ${light ? 'text-white/70' : 'text-ash'}`}>
            <span className={`h-px flex-1 ${light ? 'bg-white/40' : 'bg-fg/30'}`} />
            <span className="tracking-[0.18em] whitespace-nowrap">Dream. Search. Live</span>
            <span className={`h-px flex-1 ${light ? 'bg-white/40' : 'bg-fg/30'}`} />
          </span>
        )}
      </span>
    </span>
  );
}
