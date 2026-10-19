import { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, Plus, Search } from 'lucide-react';
import { useAdminUsersViewModel } from '@/features/admin/viewmodel/useAdminUsersViewModel';
import { USER_ROLES, USER_SUB_TYPES, isStaffRole, type UserRole, type UserSubType } from '@/features/admin/model/user';
import EmailUsersDialog from '@/features/admin/ui/EmailUsersDialog';
import Modal from '@/core/widgets/Modal';
import { t } from '@/core/utils/i18n';

const field = 'w-full rounded-lg border border-fg/15 bg-white px-3 py-2 text-sm text-fg focus:outline-none focus:border-gold';

export default function AdminUsers() {
  const vm = useAdminUsersViewModel();
  const [emailing, setEmailing] = useState(false);
  const d = vm.draft;
  const staff = isStaffRole(d.role);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="font-display font-semibold text-fg text-2xl">{t('users.title')}</h1>
        <div className="flex gap-2">
          <button onClick={() => setEmailing(true)} className="neopop-btn neopop-btn-outline"><Mail size={16} /> <span className="hidden sm:inline">{t('email.open')}</span></button>
          <button onClick={vm.openAdd} className="neopop-btn"><Plus size={16} /> {t('users.add')}</button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-card p-2 mb-3">
        <label className="relative block">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ash" />
          <input value={vm.search} onChange={(e) => vm.setSearch(e.target.value)} placeholder={t('users.search')} className={`${field} pl-8`} />
        </label>
        <div className="flex gap-1.5 mt-2 overflow-x-auto [scrollbar-width:none]" role="group" aria-label={t('users.filter')}>
          {(['All', ...USER_ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => vm.pickRole(r)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${vm.role === r ? 'bg-fg text-white' : 'bg-ink-800 text-ash hover:text-fg'}`}
            >
              {r === 'All' ? t('users.all') : t(`role.${r}`)}
            </button>
          ))}
        </div>
      </div>

      {vm.notice && <p role="status" className="text-emerald-600 text-sm mb-2">{vm.notice}</p>}
      {vm.status === 'ready' && <p className="text-ash text-sm mb-2">{vm.total === 1 ? t('users.countOne') : t('users.showing', { count: vm.total })}</p>}
      {vm.status === 'loading' && <p className="text-ash text-sm mb-2">{t('profile.loading')}</p>}
      {vm.status === 'error' && (
        <p className="text-red-600 text-sm mb-2">{t('users.loadError', { detail: vm.error ? ` (${vm.error})` : '' })} <button onClick={vm.reload} className="underline">{t('users.retry')}</button></p>
      )}

      <div className="space-y-2">
        {vm.items.map((u) => (
          <div key={u.id} className="flex items-center gap-3 rounded-xl bg-white shadow-card p-3">
            <span className="w-10 h-10 rounded-full bg-fg text-white flex items-center justify-center text-sm font-bold shrink-0">
              {(u.name || u.username).charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                <span className="truncate">{u.name}</span>
                {u.subType && <span className="rounded-full bg-gold/15 text-gold text-[0.65rem] font-bold px-2 py-0.5">{u.subType}</span>}
              </span>
              <span className="block text-xs text-ash truncate">{u.countryCode} {u.mobileNumber} · {u.email}</span>
              {u.notes && <span className="block text-xs text-ash-dark truncate">{u.notes}</span>}
            </span>
            <span className="text-right shrink-0">
              <span className="block text-xs font-semibold text-fg">{t(`role.${u.role}`)}</span>
              <span className="block text-xs text-ash">{t('users.deals', { count: u.dealsCount })}</span>
            </span>
          </div>
        ))}
        {vm.status === 'ready' && vm.items.length === 0 && <p className="text-ash py-8 text-center">{t('users.none')}</p>}
      </div>

      {vm.totalPages > 1 && (
        <nav aria-label={t('listings.pagination')} className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => vm.setPage(vm.page - 1)} disabled={vm.page <= 1} className="neopop-btn neopop-btn-outline disabled:opacity-40"><ChevronLeft size={16} /> {t('listings.prev')}</button>
          <span className="text-sm text-ash">{t('listings.pageOf', { page: vm.page, total: vm.totalPages })}</span>
          <button onClick={() => vm.setPage(vm.page + 1)} disabled={vm.page >= vm.totalPages} className="neopop-btn neopop-btn-outline disabled:opacity-40">{t('listings.next')} <ChevronRight size={16} /></button>
        </nav>
      )}

      <Modal open={vm.adding} onClose={vm.saving ? () => {} : vm.closeAdd} title={t('users.formTitle')}>
        <form onSubmit={(e) => { e.preventDefault(); vm.submit(); }} className="grid grid-cols-2 gap-3 -mt-2">
          <Field label={t('users.name')} className="col-span-2"><input className={field} value={d.name} onChange={(e) => vm.change({ name: e.target.value })} /></Field>
          <Field label={t('users.email')} className="col-span-2"><input type="email" className={field} value={d.email} onChange={(e) => vm.change({ email: e.target.value })} /></Field>
          <Field label={t('users.countryCode')}><input className={field} value={d.countryCode} onChange={(e) => vm.change({ countryCode: e.target.value })} /></Field>
          <Field label={t('users.mobile')}><input type="tel" className={field} value={d.mobileNumber} onChange={(e) => vm.change({ mobileNumber: e.target.value })} /></Field>
          <Field label={t('users.role')} className="col-span-2">
            <select className={field} value={d.role} onChange={(e) => vm.change({ role: e.target.value as UserRole })}>
              {USER_ROLES.map((r) => <option key={r} value={r}>{t(`role.${r}`)}</option>)}
            </select>
          </Field>
          {staff && (
            <>
              <Field label={t('users.username')} className="col-span-2"><input className={field} value={d.username} autoComplete="off" onChange={(e) => vm.change({ username: e.target.value })} /></Field>
              <Field label={t('users.password')} className="col-span-2"><input type="password" autoComplete="new-password" className={field} value={d.password} onChange={(e) => vm.change({ password: e.target.value })} /></Field>
            </>
          )}
          {!staff && (
            <>
              <Field label={t('users.subType')}>
                <select className={field} value={d.subType ?? ''} onChange={(e) => vm.change({ subType: (e.target.value || undefined) as UserSubType | undefined })}>
                  <option value="">{t('users.subTypeNone')}</option>
                  {USER_SUB_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t('users.dealsCount')}><input type="number" min={0} className={field} value={d.dealsCount} onChange={(e) => vm.change({ dealsCount: Number(e.target.value) })} /></Field>
            </>
          )}
          <Field label={t('users.notes')} className="col-span-2"><textarea rows={3} maxLength={5000} className={field} placeholder={t('users.notesPh')} value={d.notes} onChange={(e) => vm.change({ notes: e.target.value })} /></Field>
          {vm.formError && <p role="alert" className="col-span-2 text-sm text-red-600">{vm.formError}</p>}
          <div className="col-span-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end mt-2">
            <button type="button" onClick={vm.closeAdd} disabled={vm.saving} className="neopop-btn neopop-btn-outline justify-center">{t('users.cancel')}</button>
            <button type="submit" disabled={vm.saving} className="neopop-btn justify-center disabled:opacity-60">{vm.saving ? t('users.saving') : t('users.save')}</button>
          </div>
        </form>
      </Modal>

      <EmailUsersDialog open={emailing} onClose={() => setEmailing(false)} />
    </div>
  );
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{label}</span>
      {children}
    </label>
  );
}
