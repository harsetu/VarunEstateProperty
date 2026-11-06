import { useCallback, useEffect, useMemo, useState } from 'react';
import { inboxRepository } from '@/app/container';
import type { ChatMessage, Conversation } from '@/features/admin/model/inbox';
import { HttpError } from '@/core/network/tokens';
import { t } from '@/core/utils/i18n';

type Status = 'loading' | 'ready' | 'error';

const failure = (e: unknown) =>
  e instanceof HttpError && (e.status === 401 || e.status === 403) ? t('inbox.denied') : e instanceof Error ? e.message : t('inbox.loadFailed');

/** Conversation list (paged) from the chat service, plus the history of the one that is open. */
export function useInboxViewModel() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgStatus, setMsgStatus] = useState<Status>('ready');
  const [msgError, setMsgError] = useState('');
  const [msgPage, setMsgPage] = useState(1);
  const [olderLeft, setOlderLeft] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const load = useCallback(async () => {
    if (!inboxRepository) return;
    setStatus('loading');
    try {
      const first = await inboxRepository.conversations(1);
      setItems(first.items);
      setPage(1);
      setHasMore(first.hasMore);
      setStatus('ready');
    } catch (e) {
      setError(failure(e));
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadMore = async () => {
    if (!inboxRepository || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = await inboxRepository.conversations(page + 1);
      setItems((all) => [...all, ...next.items.filter((n) => !all.some((a) => a.id === n.id))]);
      setPage((p) => p + 1);
      setHasMore(next.hasMore);
    } catch (e) {
      setError(failure(e));
    } finally {
      setLoadingMore(false);
    }
  };

  const open = async (c: Conversation | null) => {
    setSelected(c);
    setMessages([]);
    setMsgError('');
    setMsgPage(1);
    setOlderLeft(false);
    if (!c || !inboxRepository) return;
    setMsgStatus('loading');
    try {
      const first = await inboxRepository.history(c, 1);
      setMessages(first.items);
      setOlderLeft(first.hasMore);
      setMsgStatus('ready');
    } catch (e) {
      setMsgError(failure(e));
      setMsgStatus('error');
    }
  };

  const loadOlder = async () => {
    if (!inboxRepository || !selected || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const older = await inboxRepository.history(selected, msgPage + 1);
      setMessages((all) => [...older.items.filter((o) => !all.some((a) => a.id === o.id)), ...all]);
      setMsgPage((p) => p + 1);
      setOlderLeft(older.hasMore);
    } catch (e) {
      setMsgError(failure(e));
    } finally {
      setLoadingOlder(false);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((c) => `${c.name} ${c.phone ?? ''} ${c.lastMessage ?? ''}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  return {
    available: !!inboxRepository,
    items: visible, status, error, reload: load, hasMore, loadMore, loadingMore,
    query, setQuery, selected, open, messages, msgStatus, msgError, olderLeft, loadOlder, loadingOlder,
  };
}
