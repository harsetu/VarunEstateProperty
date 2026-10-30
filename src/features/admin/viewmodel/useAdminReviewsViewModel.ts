import { useCallback, useEffect, useState } from 'react';
import { reviewRepository } from '@/app/container';
import {
  REVIEW_TEXT_MAX, REVIEW_URL_MAX, isHttpUrl,
  type Review, type ReviewInput, type ReviewType,
} from '@/features/reviews/model/review';
import { HttpError } from '@/core/network/tokens';
import { t } from '@/core/utils/i18n';

export type ReviewFilter = 'All' | ReviewType;

interface Draft { type: ReviewType; text: string; videoUrl: string }
const BLANK: Draft = { type: 'TEXT', text: '', videoUrl: '' };

export const validateReview = (d: Draft) => {
  if (d.type === 'TEXT') {
    if (!d.text.trim()) return t('reviews.errTextEmpty');
    if (d.text.length > REVIEW_TEXT_MAX) return t('reviews.errTextLong', { max: REVIEW_TEXT_MAX });
    return null;
  }
  if (!d.videoUrl.trim()) return t('reviews.errUrlEmpty');
  if (d.videoUrl.trim().length > REVIEW_URL_MAX) return t('reviews.errUrlLong', { max: REVIEW_URL_MAX });
  if (!isHttpUrl(d.videoUrl)) return t('reviews.errUrlInvalid');
  return null;
};

const toInput = (d: Draft): ReviewInput =>
  d.type === 'TEXT' ? { type: 'TEXT', text: d.text.trim() } : { type: 'VIDEO', videoUrl: d.videoUrl.trim() };

/** List, filter, add, edit and delete reviews. */
export function useAdminReviewsViewModel() {
  const [filter, setFilter] = useState<ReviewFilter>('All');
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error' | 'denied'; error?: string; items: Review[] }>({
    status: 'loading', items: [],
  });
  const [attempt, setAttempt] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!reviewRepository) return;
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading', error: undefined }));
    reviewRepository.list()
      .then((items) => !cancelled && setState({ status: 'ready', items }))
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof HttpError && e.status === 403) return setState({ status: 'denied', items: [] });
        setState({ status: 'error', items: [], error: e instanceof Error ? e.message : t('error.generic') });
      });
    return () => { cancelled = true; };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const items = filter === 'All' ? state.items : state.items.filter((r) => r.type === filter);

  // ---- add / edit ----
  const [editing, setEditing] = useState<{ id: number | null } | null>(null);
  const [draft, setDraft] = useState<Draft>(BLANK);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openAdd = () => { setDraft(BLANK); setFormError(null); setEditing({ id: null }); };
  const openEdit = (r: Review) => {
    setDraft({ type: r.type, text: r.text ?? '', videoUrl: r.videoUrl ?? '' });
    setFormError(null);
    setEditing({ id: r.id });
  };
  const closeForm = () => setEditing(null);
  const change = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  /** Switching the type clears the field of the other type. */
  const pickType = (type: ReviewType) => setDraft((d) => (d.type === type ? d : { type, text: '', videoUrl: '' }));

  const submit = async () => {
    if (!reviewRepository || !editing) return;
    const problem = validateReview(draft);
    if (problem) return setFormError(problem);
    setSaving(true);
    setFormError(null);
    try {
      if (editing.id === null) await reviewRepository.create(toInput(draft));
      else await reviewRepository.update(editing.id, toInput(draft));
      setNotice(t(editing.id === null ? 'reviews.added' : 'reviews.updated'));
      setEditing(null);
      reload();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : t('error.generic'));
    } finally {
      setSaving(false);
    }
  };

  // ---- delete ----
  const [deleting, setDeleting] = useState<Review | null>(null);
  const [removing, setRemoving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const askDelete = (r: Review) => { setDeleteError(null); setDeleting(r); };
  const cancelDelete = () => setDeleting(null);
  const confirmDelete = async () => {
    if (!reviewRepository || !deleting) return;
    setRemoving(true);
    setDeleteError(null);
    try {
      await reviewRepository.remove(deleting.id);
      setState((s) => ({ ...s, items: s.items.filter((r) => r.id !== deleting.id) }));
      setNotice(t('reviews.deleted'));
      setDeleting(null);
    } catch (e) {
      // A 404 means it was already gone; anything else is shown to the admin
      if (e instanceof HttpError && e.status === 404) { setDeleting(null); reload(); }
      else setDeleteError(e instanceof Error ? e.message : t('reviews.deleteFailed'));
    } finally {
      setRemoving(false);
    }
  };

  return {
    available: !!reviewRepository,
    status: state.status, error: state.error, items, total: state.items.length, reload, notice,
    filter, setFilter,
    editing, draft, saving, formError, openAdd, openEdit, closeForm, change, pickType, submit,
    deleting, removing, deleteError, askDelete, cancelDelete, confirmDelete,
  };
}
