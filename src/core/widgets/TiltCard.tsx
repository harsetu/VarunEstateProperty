import { useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
}

// Tilts toward the cursor with a moving glare. Children can use
// [transform:translateZ(..)] to float above the card surface.
export default function TiltCard({ children, className = '', max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div className="[perspective:1000px] h-full">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`tilt-3d group/tilt relative h-full ${className}`}
      >
        {children}
        <div className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit]" />
      </div>
    </div>
  );
}
