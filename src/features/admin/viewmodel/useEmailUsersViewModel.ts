import { useEffect, useState } from 'react';
import { userRepository } from '@/app/container';
import { USER_ROLES, type MailAttachment, type UserRole } from '@/features/admin/model/user';
import { t } from '@/core/utils/i18n';

const SUBJECT_MAX = 200;

/** Compose-and-send state for emailing every user in the chosen roles. */
export function useEmailUsersViewModel(open: boolean) {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [counts, setCounts] = useState<Partial<Record<UserRole, number>>>({});
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<MailAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<number | null>(null);

  // Start fresh each time the dialog opens, and load how many people each role has
  useEffect(() => {
    if (!open || !userRepository) return;
    setRoles([]); setSubject(''); setMessage(''); setImages([]); setAttachments([]); setConfirming(false); setError(null); setSent(null); setCounts({});
    let cancelled = false;
    USER_ROLES.forEach((r) =>
      userRepository!.count(r).then((n) => !cancelled && setCounts((c) => ({ ...c, [r]: n }))).catch(() => undefined),
    );
    return () => { cancelled = true; };
  }, [open]);

  const upload = async (files: FileList | File[], onDone: (done: MailAttachment[]) => void) => {
    if (!userRepository) return;
    setUploading(true);
    setError(null);
    try {
      onDone(await Promise.all([...files].map((f) => userRepository!.uploadAttachment(f))));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error.generic'));
    } finally {
      setUploading(false);
    }
  };
  const addImages = (files: FileList | File[]) => upload(files, (done) => setImages((l) => [...l, ...done.map((d) => d.url)]));
  const addAttachments = (files: FileList | File[]) => upload(files, (done) => setAttachments((l) => [...l, ...done]));
  const removeImage = (i: number) => setImages((l) => l.filter((_, n) => n !== i));
  const removeAttachment = (i: number) => setAttachments((l) => l.filter((_, n) => n !== i));

  const toggleRole = (r: UserRole) => setRoles((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));
  const recipients = roles.reduce((sum, r) => sum + (counts[r] ?? 0), 0);
  const countsKnown = roles.every((r) => counts[r] !== undefined);

  const problem = () => {
    if (roles.length === 0) return t('email.errRoles');
    if (countsKnown && recipients === 0) return t('email.errNobody');
    if (!subject.trim()) return t('email.errSubject');
    if (!message.trim()) return t('email.errMessage');
    if (uploading) return t('email.errUploading');
    return null;
  };

  const review = () => {
    const p = problem();
    setError(p);
    if (!p) setConfirming(true);
  };

  const send = async () => {
    if (!userRepository) return;
    setSending(true);
    setError(null);
    try {
      const reported = await userRepository.sendEmail({ roles, subject, message, images, attachments });
      setSent(reported ?? recipients);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error.generic'));
    } finally {
      setSending(false);
      setConfirming(false);
    }
  };

  return {
    roles, counts, toggleRole, recipients, countsKnown, subject, setSubject, message, setMessage,
    images, attachments, uploading, addImages, addAttachments, removeImage, removeAttachment,
    subjectMax: SUBJECT_MAX, confirming, cancelConfirm: () => setConfirming(false), review, send, sending, error, sent,
  };
}
