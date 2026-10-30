import { useEffect, useState } from 'react';
import { userRepository } from '@/app/container';
import { USER_ROLES, parseRecipientRange, type AppUser, type MailAttachment, type UserRole } from '@/features/admin/model/user';
import { t } from '@/core/utils/i18n';

const SUBJECT_MAX = 200;
const SEARCH_DELAY_MS = 350;
const PAGE_SIZE = 5;

export type RecipientMode = 'groups' | 'people';

/** Compose-and-send state for emailing every user in the chosen roles. */
export function useEmailUsersViewModel(open: boolean) {
  const [mode, setMode] = useState<RecipientMode>('groups');
  const [roles, setRoles] = useState<UserRole[]>([]);
  // "people" mode: search the user list and tick the ones to email
  const [search, setSearch] = useState('');
  const [found, setFound] = useState<{ status: 'idle' | 'loading' | 'ready' | 'error'; items: AppUser[]; page: number; totalPages: number; loadingMore: boolean }>({
    status: 'idle', items: [], page: 0, totalPages: 1, loadingMore: false,
  });
  const [picked, setPicked] = useState<AppUser[]>([]);
  const [counts, setCounts] = useState<Partial<Record<UserRole, number>>>({});
  const [rangeText, setRangeText] = useState('');
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
    setMode('groups'); setSearch(''); setPicked([]); setRoles([]); setRangeText(''); setSubject(''); setMessage(''); setImages([]); setAttachments([]); setConfirming(false); setError(null); setSent(null); setCounts({});
    let cancelled = false;
    USER_ROLES.forEach((r) =>
      userRepository!.count(r).then((n) => !cancelled && setCounts((c) => ({ ...c, [r]: n }))).catch(() => undefined),
    );
    return () => { cancelled = true; };
  }, [open]);

  // Search as the admin types; results come 5 at a time and the next 5 load as the list is scrolled
  useEffect(() => {
    if (!open || mode !== 'people' || !userRepository) return;
    let cancelled = false;
    const id = setTimeout(() => {
      setFound({ status: 'loading', items: [], page: 0, totalPages: 1, loadingMore: false });
      userRepository!.list({ page: 1, size: PAGE_SIZE, role: 'All', q: search })
        .then((r) => !cancelled && setFound({ status: 'ready', items: r.items, page: 1, totalPages: r.totalPages, loadingMore: false }))
        .catch(() => !cancelled && setFound({ status: 'error', items: [], page: 0, totalPages: 1, loadingMore: false }));
    }, SEARCH_DELAY_MS);
    return () => { cancelled = true; clearTimeout(id); };
  }, [open, mode, search]);

  const hasMore = found.status === 'ready' && found.page < found.totalPages;
  const loadMore = () => {
    if (!userRepository || !hasMore || found.loadingMore) return;
    const next = found.page + 1;
    setFound((f) => ({ ...f, loadingMore: true }));
    userRepository.list({ page: next, size: PAGE_SIZE, role: 'All', q: search })
      .then((r) => setFound((f) => ({
        ...f, loadingMore: false, page: next, totalPages: r.totalPages,
        items: [...f.items, ...r.items.filter((u) => !f.items.some((x) => x.id === u.id))],
      })))
      .catch(() => setFound((f) => ({ ...f, loadingMore: false })));
  };

  const isPicked = (id: number) => picked.some((u) => u.id === id);
  const togglePicked = (u: AppUser) => setPicked((cur) => (cur.some((x) => x.id === u.id) ? cur.filter((x) => x.id !== u.id) : [...cur, u]));
  const removePicked = (id: number) => setPicked((cur) => cur.filter((u) => u.id !== id));

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
  const totalInRoles = roles.reduce((sum, r) => sum + (counts[r] ?? 0), 0);
  const countsKnown = roles.every((r) => counts[r] !== undefined);
  // Empty = everyone in the roles; otherwise only those positions (1-based, oldest first)
  const rangeUsed = rangeText.trim() !== '';
  const range = rangeUsed ? parseRecipientRange(rangeText) : null;
  const recipients = mode === 'people' ? picked.length : range ? Math.max(0, Math.min(range.to, totalInRoles) - range.from + 1) : totalInRoles;

  const problem = () => {
    if (mode === 'people') {
      if (picked.length === 0) return t('email.errPeople');
    } else {
      if (roles.length === 0) return t('email.errRoles');
      if (rangeUsed && !range) return t('email.errRange');
      if (countsKnown && totalInRoles === 0) return t('email.errNobody');
      if (range && countsKnown && range.from > totalInRoles) return t('email.errRangeBeyond', { total: totalInRoles });
    }
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
      const reported = await userRepository.sendEmail({ ...(mode === 'people' ? { roles: [], userIds: picked.map((u) => u.id) } : { roles, ...(range && { range }) }), subject, message, images, attachments });
      setSent(reported ?? recipients);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('error.generic'));
    } finally {
      setSending(false);
      setConfirming(false);
    }
  };

  return {
    mode, setMode, search, setSearch, found, hasMore, loadMore, picked, isPicked, togglePicked, removePicked,
    roles, counts, toggleRole, recipients, totalInRoles, countsKnown, rangeText, setRangeText, rangeUsed, range, subject, setSubject, message, setMessage,
    images, attachments, uploading, addImages, addAttachments, removeImage, removeAttachment,
    subjectMax: SUBJECT_MAX, confirming, cancelConfirm: () => setConfirming(false), review, send, sending, error, sent,
  };
}
