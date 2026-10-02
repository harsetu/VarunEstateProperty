import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// Centered dialog on desktop, bottom sheet on mobile. Esc / backdrop closes it.
export default function Modal({ open, onClose, title, subtitle, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[7000] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-night/60 backdrop-blur-sm animate-[modalFade_0.2s_ease-out]" onClick={onClose} />
      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-card-hover p-6 sm:p-8 animate-[modalUp_0.3s_cubic-bezier(0.22,1,0.36,1)]">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-ash hover:bg-ink-800 hover:text-fg transition-colors">
          <X size={18} />
        </button>
        <h2 className="font-display font-semibold text-fg text-2xl pr-8">{title}</h2>
        {subtitle && <p className="text-ash text-sm mt-1.5">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      <style>{`
        @keyframes modalFade { from { opacity: 0 } }
        @keyframes modalUp { from { opacity: 0; transform: translateY(24px) } }
      `}</style>
    </div>
  );
}

export const fieldClass =
  'w-full rounded-xl border border-fg/15 bg-white px-4 py-3 text-fg placeholder:text-ash-dark focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition';

export const labelClass = 'block text-sm font-medium text-fg mb-1.5';
