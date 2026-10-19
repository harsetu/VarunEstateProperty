import { useRef } from 'react';
import { CheckCircle2, FileText, ImagePlus, Loader2, Paperclip, Send, X } from 'lucide-react';
import Modal from '@/core/widgets/Modal';
import ConfirmDialog from '@/core/widgets/ConfirmDialog';
import { USER_ROLES } from '@/features/admin/model/user';
import { ATTACHMENT_TYPES } from '@/features/admin/repository/ApiUserRepository';
import { useEmailUsersViewModel } from '@/features/admin/viewmodel/useEmailUsersViewModel';
import { t } from '@/core/utils/i18n';

const field = 'w-full rounded-lg border border-fg/15 bg-white px-3 py-2 text-sm text-fg focus:outline-none focus:border-gold';

export default function EmailUsersDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const vm = useEmailUsersViewModel(open);
  const imageInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <Modal open={open} onClose={vm.sending ? () => {} : onClose} title={t('email.title')} subtitle={t('email.subtitle')}>
        {vm.sent !== null ? (
          <div className="text-center py-4">
            <CheckCircle2 size={44} className="text-emerald-600 mx-auto mb-3" />
            <p className="font-semibold text-fg">{t('email.sentTitle')}</p>
            <p className="text-ash text-sm mt-1">{t('email.sentBody', { count: vm.sent })}</p>
            <button onClick={onClose} className="neopop-btn mt-6">{t('email.done')}</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); vm.review(); }} className="space-y-4 -mt-2">
            <div>
              <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1.5">{t('email.to')}</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t('email.to')}>
                {USER_ROLES.map((r) => {
                  const on = vm.roles.includes(r);
                  const n = vm.counts[r];
                  return (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={on}
                      onClick={() => vm.toggleRole(r)}
                      className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${on ? 'bg-fg text-white border-fg' : 'bg-white text-ash border-fg/15 hover:text-fg'}`}
                    >
                      {t(`role.${r}`)}{n !== undefined && <span className={on ? 'text-white/70' : 'text-ash-dark'}> · {n}</span>}
                    </button>
                  );
                })}
              </div>
              {vm.roles.length > 0 && vm.countsKnown && <p className="text-xs text-ash mt-1.5">{t('email.recipients', { count: vm.recipients })}</p>}
            </div>

            <label className="block">
              <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('email.subject')}</span>
              <input className={field} maxLength={vm.subjectMax} value={vm.subject} onChange={(e) => vm.setSubject(e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{t('email.message')}</span>
              <textarea rows={7} maxLength={20000} className={field} value={vm.message} onChange={(e) => vm.setMessage(e.target.value)} placeholder={t('email.messagePh')} />
            </label>

            <div>
              <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1.5">{t('email.extras')}</span>
              <input ref={imageInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden
                onChange={(e) => { if (e.target.files?.length) vm.addImages(e.target.files); e.target.value = ''; }} />
              <input ref={fileInput} type="file" accept={ATTACHMENT_TYPES.join(',')} multiple hidden
                onChange={(e) => { if (e.target.files?.length) vm.addAttachments(e.target.files); e.target.value = ''; }} />
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => imageInput.current?.click()} disabled={vm.uploading} className="neopop-btn neopop-btn-outline !py-1.5 text-sm"><ImagePlus size={15} /> {t('email.addImage')}</button>
                <button type="button" onClick={() => fileInput.current?.click()} disabled={vm.uploading} className="neopop-btn neopop-btn-outline !py-1.5 text-sm"><Paperclip size={15} /> {t('email.attach')}</button>
                {vm.uploading && <span className="flex items-center gap-1 text-xs text-ash"><Loader2 size={14} className="animate-spin" /> {t('email.uploading')}</span>}
              </div>
              <p className="text-xs text-ash-dark mt-1">{t('email.extrasHint')}</p>

              {vm.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {vm.images.map((src, i) => (
                    <div key={`${src}-${i}`} className="relative w-20 h-20 rounded-lg overflow-hidden bg-ink-800">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => vm.removeImage(i)} aria-label={t('form.removeImage')} className="absolute top-1 right-1 p-0.5 rounded-full bg-white/90 text-fg hover:text-red-600"><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              {vm.attachments.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {vm.attachments.map((a, i) => (
                    <li key={`${a.url}-${i}`} className="flex items-center gap-2 rounded-lg bg-ink-800 px-3 py-1.5 text-sm text-fg">
                      <FileText size={15} className="text-gold shrink-0" />
                      <span className="truncate flex-1">{a.name}</span>
                      <button type="button" onClick={() => vm.removeAttachment(i)} aria-label={t('form.remove', { name: a.name })} className="text-ash hover:text-red-600"><X size={15} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {vm.error && <p role="alert" className="text-sm text-red-600">{vm.error}</p>}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button type="button" onClick={onClose} className="neopop-btn neopop-btn-outline justify-center">{t('users.cancel')}</button>
              <button type="submit" className="neopop-btn justify-center"><Send size={16} /> {t('email.review')}</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={vm.confirming}
        title={t('email.confirmTitle')}
        message={t('email.confirmBody', { count: vm.recipients, subject: vm.subject.trim() })}
        confirmLabel={vm.sending ? t('email.sending') : t('email.send')}
        busy={vm.sending}
        onCancel={vm.cancelConfirm}
        onConfirm={vm.send}
      />
    </>
  );
}
