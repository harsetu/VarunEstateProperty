import Modal from '@/core/widgets/Modal';
import { t } from '@/core/utils/i18n';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmation prompt: centered dialog on desktop, bottom sheet on mobile. */
export default function ConfirmDialog({ open, title, message, confirmLabel, busy, error, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onCancel} title={title}>
      <p className="text-ash -mt-2">{message}</p>
      {error && <p role="alert" className="text-sm text-red-600 mt-3">{error}</p>}
      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 sm:justify-end">
        <button onClick={onCancel} disabled={busy} className="neopop-btn neopop-btn-outline justify-center disabled:opacity-50">
          {t('confirm.cancel')}
        </button>
        <button onClick={onConfirm} disabled={busy} className="neopop-btn justify-center !bg-red-600 !border-red-600 text-white disabled:opacity-60">
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
