import { useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Search } from 'lucide-react';
import { useInboxViewModel } from '@/features/admin/viewmodel/useInboxViewModel';
import { formatInboxTime, type Conversation } from '@/features/admin/model/inbox';
import { t } from '@/core/utils/i18n';

const initial = (c: Conversation) => (c.name.match(/[A-Za-z0-9]/)?.[0] ?? '#').toUpperCase();

function Avatar({ c }: { c: Conversation }) {
  return <span className="w-10 h-10 shrink-0 rounded-full bg-fg text-white flex items-center justify-center text-sm font-bold">{initial(c)}</span>;
}

/** Inbox of customer chats (third-party chat service) with each conversation's history. */
export default function AdminInbox() {
  const vm = useInboxViewModel();
  const end = useRef<HTMLDivElement>(null);
  const c = vm.selected;

  // Newest message in view when a conversation opens (not when older ones are added above)
  const newest = vm.messages[vm.messages.length - 1]?.id;
  useEffect(() => { end.current?.scrollIntoView(); }, [newest, c?.id]);

  if (!vm.available) return <p className="text-ash py-8 text-center">{t('inbox.notSetUp')}</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="font-display font-semibold text-fg text-2xl">{t('inbox.title')}</h1>
        <button onClick={vm.reload} aria-label={t('inbox.refresh')} className="p-2 rounded-full text-ash hover:bg-ink-800 hover:text-fg"><RefreshCw size={18} /></button>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-4 items-start">
        {/* Conversation list: hidden on phones while a chat is open */}
        <section className={`${c ? 'hidden lg:block' : ''} rounded-2xl bg-white shadow-card overflow-hidden`}>
          <label className="flex items-center gap-2 px-4 py-3 border-b border-fg/10 text-ash">
            <Search size={16} />
            <input value={vm.query} onChange={(e) => vm.setQuery(e.target.value)} placeholder={t('inbox.search')} className="w-full bg-transparent text-sm text-fg focus:outline-none" />
          </label>
          <div className="max-h-[calc(100svh-15rem)] overflow-y-auto divide-y divide-fg/5">
            {vm.status === 'loading' && <p className="text-ash text-sm p-4">{t('inbox.loading')}</p>}
            {vm.status === 'error' && (
              <p role="alert" className="text-red-600 text-sm p-4">{vm.error} <button onClick={vm.reload} className="underline">{t('inbox.retry')}</button></p>
            )}
            {vm.status === 'ready' && vm.items.length === 0 && <p className="text-ash text-sm p-6 text-center">{t('inbox.none')}</p>}
            {vm.items.map((x) => (
              <button key={x.id} onClick={() => vm.open(x)} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-ink-800 transition-colors ${c?.id === x.id ? 'bg-ink-800' : ''}`}>
                <Avatar c={x} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-fg text-sm truncate">{x.name}</span>
                    <span className="text-[0.6875rem] text-ash shrink-0">{formatInboxTime(x.lastAt)}</span>
                  </span>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-ash text-xs truncate">{x.lastMessage || x.phone || ''}</span>
                    {x.unread > 0 && <span className="shrink-0 rounded-full bg-gold text-white text-[0.625rem] font-bold px-1.5 py-0.5">{x.unread}</span>}
                  </span>
                </span>
              </button>
            ))}
            {vm.hasMore && vm.status === 'ready' && (
              <button onClick={vm.loadMore} disabled={vm.loadingMore} className="w-full py-3 text-sm font-semibold text-gold hover:bg-ink-800 disabled:opacity-60">
                {vm.loadingMore ? t('inbox.loading') : t('inbox.loadMore')}
              </button>
            )}
          </div>
        </section>

        {/* History of the open conversation */}
        <section className={`${c ? '' : 'hidden lg:block'} rounded-2xl bg-white shadow-card overflow-hidden`}>
          {!c ? (
            <p className="text-ash text-sm p-10 text-center">{t('inbox.pick')}</p>
          ) : (
            <>
              <header className="flex items-center gap-3 px-4 py-3 border-b border-fg/10">
                <button onClick={() => vm.open(null)} aria-label={t('inbox.back')} className="lg:hidden -ml-2 p-2 rounded-full text-fg hover:bg-ink-800"><ArrowLeft size={20} /></button>
                <Avatar c={c} />
                <span className="min-w-0">
                  <span className="block font-semibold text-fg text-sm truncate">{c.name}</span>
                  <span className="block text-ash text-xs truncate">{[c.phone, c.channel].filter(Boolean).join(' · ')}</span>
                </span>
              </header>
              <div className="h-[calc(100svh-17rem)] min-h-[300px] overflow-y-auto bg-ink-900 p-4 space-y-2">
                {vm.olderLeft && (
                  <button onClick={vm.loadOlder} disabled={vm.loadingOlder} className="block mx-auto rounded-full bg-white shadow-card px-4 py-1.5 text-xs font-semibold text-gold disabled:opacity-60">
                    {vm.loadingOlder ? t('inbox.loading') : t('inbox.loadOlder')}
                  </button>
                )}
                {vm.msgStatus === 'loading' && <p className="text-ash text-sm">{t('inbox.loadingHistory')}</p>}
                {vm.msgStatus === 'error' && <p role="alert" className="text-red-600 text-sm">{vm.msgError}</p>}
                {vm.msgStatus === 'ready' && vm.messages.length === 0 && <p className="text-ash text-sm text-center py-8">{t('inbox.noMessages')}</p>}
                {vm.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-card ${m.direction === 'out' ? 'bg-fg text-white rounded-br-sm' : 'bg-white text-fg rounded-bl-sm'}`}>
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <p className={`text-[0.625rem] mt-1 text-right ${m.direction === 'out' ? 'text-white/60' : 'text-ash'}`}>{formatInboxTime(m.at)}</p>
                    </div>
                  </div>
                ))}
                <div ref={end} />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
