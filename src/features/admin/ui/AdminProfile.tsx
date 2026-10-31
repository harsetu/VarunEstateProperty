import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useProfileViewModel } from '@/features/admin/viewmodel/useProfileViewModel';
import { t } from '@/core/utils/i18n';

const field = 'w-full rounded-xl border border-fg/15 bg-white px-4 py-2.5 text-fg focus:outline-none focus:border-gold';

export default function AdminProfile() {
  const vm = useProfileViewModel();
  const p = vm.profile;
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const submitPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await vm.changePassword(pw.current, pw.next, pw.confirm)) setPw({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display font-semibold text-fg text-2xl mb-4">{t('profile.title')}</h1>

      {vm.message && <p role="status" className={`text-sm mb-3 ${vm.message.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>{vm.message.text}</p>}
      {vm.loading && <p className="text-ash">{t('profile.loading')}</p>}

      {p && (
        <form onSubmit={(e) => { e.preventDefault(); vm.save(); }} className="rounded-2xl bg-white shadow-card p-5 grid sm:grid-cols-2 gap-4">
          {([
            [t('profile.username'), 'username', 'sm:col-span-2', 'text'],
            [t('profile.name'), 'name', 'sm:col-span-2', 'text'],
            [t('profile.email'), 'email', 'sm:col-span-2', 'email'],
            [t('profile.countryCode'), 'countryCode', '', 'text'],
            [t('profile.mobile'), 'mobileNumber', '', 'tel'],
          ] as const).map(([label, key, span, type]) => (
            <label key={key} className={`block ${span}`}>
              <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{label}</span>
              <input type={type} required className={field} value={p[key] ?? ''} onChange={(e) => vm.change({ [key]: e.target.value })} />
            </label>
          ))}
          {p.role && <p className="sm:col-span-2 text-xs text-ash">{t('profile.role', { role: p.role })}</p>}
          <button type="submit" disabled={vm.busy} className="neopop-btn sm:col-span-2 justify-center disabled:opacity-60">
            {vm.busy ? t('profile.saving') : t('profile.save')}
          </button>
        </form>
      )}

      <form onSubmit={submitPw} className="mt-6 rounded-2xl bg-white shadow-card p-5 grid gap-4">
        <h2 className="font-display font-semibold text-fg text-lg">{t('profile.pwTitle')}</h2>
        {vm.pwMessage && <p role="status" className={`text-sm ${vm.pwMessage.kind === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>{vm.pwMessage.text}</p>}
        {([
          [t('profile.pwCurrent'), 'current', 'current-password'],
          [t('profile.pwNew'), 'next', 'new-password'],
          [t('profile.pwConfirm'), 'confirm', 'new-password'],
        ] as const).map(([label, key, auto]) => (
          <label key={key} className="block">
            <span className="block text-xs font-semibold text-ash-dark uppercase tracking-wider mb-1">{label}</span>
            <input type="password" required autoComplete={auto} className={field} value={pw[key]} onChange={(e) => setPw({ ...pw, [key]: e.target.value })} />
          </label>
        ))}
        <button type="submit" disabled={vm.pwBusy} className="neopop-btn justify-center disabled:opacity-60">
          {vm.pwBusy ? t('profile.pwSaving') : t('profile.pwSave')}
        </button>
      </form>

      <button onClick={vm.signOut} className="mt-6 flex items-center gap-2 text-red-600 font-semibold">
        <LogOut size={16} /> {t('profile.signOut')}
      </button>
    </div>
  );
}
