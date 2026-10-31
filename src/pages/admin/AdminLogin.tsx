import { Navigate } from 'react-router-dom';
import { CONTACT } from '@/data/contact';
import { useAdminLoginViewModel } from '@/presentation/viewmodels/useAdminLoginViewModel';
import { t } from '@/i18n';

const input = 'w-full rounded-xl border border-fg/15 bg-white px-4 py-3 text-fg focus:outline-none focus:border-gold';

export default function AdminLogin() {
  const vm = useAdminLoginViewModel();

  if (vm.signedIn) return <Navigate to="/admin/home" replace />;

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-card-3d p-8">
        <p className="text-gold text-xs font-semibold uppercase tracking-[0.18em]">{t('login.title')}</p>
        <h1 className="font-display font-semibold text-fg text-2xl mt-1 mb-6">{CONTACT.company}</h1>

        {!vm.available ? (
          <p className="text-ash text-sm leading-relaxed">
            {t('login.notSetUp')}</p>
        ) : vm.loading ? (
          <p className="text-ash text-sm">{t('admin.checkingSession')}</p>
        ) : (
          <form onSubmit={vm.submit} className="space-y-4">
            <input type="text" required autoComplete="username" autoCapitalize="none" placeholder={t('login.username')} value={vm.username}
              onChange={(e) => vm.setUsername(e.target.value)} className={input} />
            <input type="password" required autoComplete="current-password" placeholder={t('login.password')} value={vm.password}
              onChange={(e) => vm.setPassword(e.target.value)} className={input} />
            {vm.error && <p className="text-red-600 text-sm" role="alert">{vm.error}</p>}
            <button type="submit" disabled={vm.busy} className="neopop-btn w-full justify-center disabled:opacity-60">
              {vm.busy ? t('login.signingIn') : t('login.signIn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
